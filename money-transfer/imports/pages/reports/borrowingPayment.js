import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {AutoForm} from 'meteor/aldeed:autoform';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import 'meteor/theara:autoprint';
import 'printthis';

// Lib
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';

// Component
import '../../../../core/imports/layouts/report/content.html';
import '../../../../core/imports/layouts/report/sign-footer.html';
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/form-footer.js';

// Method
import {borrowingPaymentReport} from '../../../common/methods/reports/borrowingPayment';

// Schema
import {BorrowingPaymentSchema} from '../../../common/collections/reports/borrowingPayment';

// Page
import './borrowingPayment.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_borrowingPaymentReport;

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

            borrowingPaymentReport.callPromise(formDataState.get())
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
        return BorrowingPaymentSchema;
    },
    rptInit(){
        let instance = Template.instance();
        return instance.rptInit.get();
    },
    rptData: function () {
        let instance = Template.instance();
        return instance.rptData.get();
    },
    No(index){
        return index += 1;
    },
    calCurrentDue(dueDoc, lastPaymentDoc){
        let principal = 0, interest = 0;
        if (dueDoc && lastPaymentDoc && lastPaymentDoc.balanceDoc) {
            principal = lastPaymentDoc.balanceDoc.principal;
            interest = dueDoc.currentInterest + lastPaymentDoc.balanceDoc.interest;
        }

        return {principal, interest};
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

AutoForm.addHooks('MoneyTransfer_borrowingPaymentReport', hooksObject);
