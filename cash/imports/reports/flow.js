import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {AutoForm} from 'meteor/aldeed:autoform';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import 'meteor/theara:autoprint';
import 'printthis';

// Lib
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';

// Component
import '../../../core/imports/layouts/report/content.html';
import '../../../core/imports/layouts/report/sign-footer.html';
import '../../../core/client/components/loading.js';
import '../../../core/client/components/form-footer.js';

// Method
import {flowReport} from '../../common/methods/reports/flow';

// Schema
import {CashSchema} from '../../common/collections/reports/cash';

// Page
import './flow.html';

// Declare template
let indexTmpl = Template.Cash_flowReport;

// State
let formDataState = new ReactiveVar(null);

// Index
indexTmpl.onCreated(function () {
    this.rptInit = new ReactiveVar(false);
    this.rptData = new ReactiveVar(null);

    this.autorun(() => {
        // Report Data
        if (formDataState.get()) {
            this.rptInit.set(true);
            this.rptData.set(false);

            let formData = formDataState.get();

            flowReport.callPromise(formData)
                .then((result)=> {
                    this.rptData.set(result);
                }).catch((err)=> {
                    console.log(err.message);
                }
            );
        }

    });
});

indexTmpl.helpers({
    schema(){
        return CashSchema;
    },
    rptInit(){
        return Template.instance().rptInit.get();
    },
    rptData: function () {
        return Template.instance().rptData.get();
    },
    No(index){
        return index += 1;
    },
    cashTypeDoc(data){
        let doc = {
            Opening: {cashType: 'Opening', KHR: 0, USD: 0, THB: 0, TotalAsUSD: 0},
            In: {cashType: 'In', KHR: 0, USD: 0, THB: 0, TotalAsUSD: 0},
            Out: {cashType: 'Out', KHR: 0, USD: 0, THB: 0, TotalAsUSD: 0},
            Closing: {cashType: 'Closing', KHR: 0, USD: 0, THB: 0, TotalAsUSD: 0},
            Balance: {cashType: 'Balance', KHR: 0, USD: 0, THB: 0, TotalAsUSD: 0}
        };

        _.forEach(data, function (cashTypeDoc) {
            _.forEach(cashTypeDoc.data, function (currencyDoc) {
                doc[cashTypeDoc.cashType][currencyDoc.currencyId] = currencyDoc.amount;
            });

            doc[cashTypeDoc.cashType].TotalAsUSD = cashTypeDoc.totalAsUSD;

            // Cal balance
            if (cashTypeDoc.cashType == 'Opening' || cashTypeDoc.cashType == 'In') {
                doc.Balance = {
                    cashType: 'Balance',
                    KHR: doc.Balance.KHR + doc[cashTypeDoc.cashType].KHR,
                    USD: doc.Balance.USD + doc[cashTypeDoc.cashType].USD,
                    THB: doc.Balance.THB + doc[cashTypeDoc.cashType].THB,
                    TotalAsUSD: doc.Balance.TotalAsUSD + doc[cashTypeDoc.cashType].TotalAsUSD
                }
            } else {
                doc.Balance = {
                    cashType: 'Balance',
                    KHR: doc.Balance.KHR - doc[cashTypeDoc.cashType].KHR,
                    USD: doc.Balance.USD - doc[cashTypeDoc.cashType].USD,
                    THB: doc.Balance.THB - doc[cashTypeDoc.cashType].THB,
                    TotalAsUSD: doc.Balance.TotalAsUSD - doc[cashTypeDoc.cashType].TotalAsUSD
                }
            }
        });


        return _.map(doc, function (o) {
            return o;
        });
    },
    amountDoc(data){
        return {
            KHR: 100,
            USD: 100,
            THB: 100
        }
    }
});

indexTmpl.events({
    'click .btn-print-this'(event, instance){
        // Print This Package
        let opts = {
            // debug: true,               // show the iframe for debugging
            // importCSS: true,            // import page CSS
            // importStyle: true,         // import style tags
            // printContainer: true,       // grab outer container as well as the contents of the selector
            // loadCSS: "path/to/my.css",  // path to additional css file - us an array [] for multiple
            // pageTitle: "",              // add title to print page
            // removeInline: false,        // remove all inline styles from print elements
            // printDelay: 333,            // variable print delay; depending on complexity a higher value may be necessary
            // header: null,               // prefix to html
            // formValues: true            // preserve input/form values
        };

        $('#print-data').printThis(opts);
    },
    'click .btn-print-area'(event, instance){
        // Print Area Package
        let opts = {
            //
        };

        $('#print-data').printArea(opts);
    }
});

indexTmpl.onDestroyed(function () {
    formDataState.set(null);
});

// hook
let hooksObject = {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();
        formDataState.set(null);

        this.done(null, insertDoc);
    },
    onSuccess: function (formType, result) {
        formDataState.set(result);
    },
    onError: function (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks('Cash_flowReport', hooksObject);
