import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {TAPi18n} from 'meteor/tap:i18n';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {BorrowingPayment} from '../../common/collections/borrowingPayment';

// Tabular
import {BorrowingPaymentTabular} from '../../common/tabulars/borrowingPayment';

// Method
import {lookupBorrowingWithLastPayment} from '../../common/methods/lookupBorrowingWithLastPayment';
import {CalInterest} from '../../common/libs/calInterest';

// Page
import './borrowingPayment.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_borrowingPayment,
    actionTmpl = Template.MoneyTransfer_borrowingPaymentAction,
    formTmpl = Template.MoneyTransfer_borrowingPaymentForm,
    showTmpl = Template.MoneyTransfer_borrowingPaymentShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('borrowingPay', {size: 'lg'});
    createNewAlertify('borrowingPayShow');
});

indexTmpl.helpers({
    tabularTable(){
        return BorrowingPaymentTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.borrowingPay(fa('plus', 'Payment'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.borrowingPay(fa('pencil', 'Payment'), renderTemplate(formTmpl, {borrowingPayId: this._id}));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            BorrowingPayment,
            {_id: this._id},
            {title: 'Payment', itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.borrowingPayShow(fa('eye', 'Payment'), renderTemplate(showTmpl, {borrowingPayId: this._id}));
    },
    'click .js-invoice' (event, instance) {
        let params = {};
        let queryParams = {borrowingPayId: this._id};
        let path = FlowRouter.path("moneyTransfer.borrowingPayInvoiceReport", params, queryParams);

        window.open(path, '_blank');
    }
});

// Form
var borrowingDocTem = new ReactiveVar();
var borrowingId = new ReactiveVar();
var paidDate = new ReactiveVar(null);

formTmpl.onCreated(function () {

});

formTmpl.onRendered(function () {
    let $paidDate = this.$('[name="paidDate"]');

    // Get default borrowing date
    paidDateAttachDTP($paidDate);

    // Tracker
    this.autorun(()=> {
        let _$paidDate = this.$('[name="paidDate"]');

        // Get borrowing and last payment doc
        if (borrowingId.get()) {
            $.blockUI();

            let params = {borrowingId: borrowingId.get()};
            lookupBorrowingWithLastPayment.callPromise(params)
                .then((result)=> {
                    // Set min of paid date
                    minPaidDate = moment(result.lastPaymentDoc.paidDate).startOf('day').toDate();
                    _$paidDate.data('DateTimePicker').options({
                        minDate: minPaidDate,
                    });

                    console.log(result);

                    borrowingDocTem.set(result);

                    $.unblockUI();
                }).catch((err)=> {
                    console.log(err.message);
                }
            );
        } else {
            borrowingDocTem.set(null);
        }
    });

});

formTmpl.helpers({
    collection(){
        return BorrowingPayment;
    },
    confirmData(){
        let borrowingDoc = borrowingDocTem.get();

        if (borrowingDoc && paidDate.get()) {
            let numOfDay = 0, currentInterest = 0, totalAmount = 0;

            // Cal num of day
            numOfDay = moment(paidDate.get()).endOf('day').diff(moment(borrowingDoc.lastPaymentDoc.paidDate).startOf('day'), 'days');

            currentInterest = CalInterest({
                amount: borrowingDoc.lastPaymentDoc.balanceDoc.principal,
                numOfDay: numOfDay,
                interestRate: borrowingDoc.interestRate,
                method: 'M',
                dayInMethod: 30,
                currencyId: borrowingDoc.currencyId
            });

            totalAmount = borrowingDoc.lastPaymentDoc.balanceDoc.principal + borrowingDoc.lastPaymentDoc.balanceDoc.interest + currentInterest;

            borrowingDoc.currentDue = {
                numOfDay,
                currentInterest,
                totalAmount,
            };
        }

        return borrowingDoc;
    },
});

formTmpl.events({
    'change [name="borrowingId"]'(event, instance){
        borrowingId.set(event.currentTarget.value);
    },
    'blur [name="paidAmount"]'(event, instance){
        let totalDue = 0;
        let borrowingDoc = borrowingDocTem.get();
        if (borrowingDoc && borrowingDoc.currentDue) {
            totalDue = borrowingDoc.currentDue.totalAmount;
        }

        // Check value
        if (parseFloat($(event.currentTarget).val()) > totalDue) {
            $(event.currentTarget).val(totalDue);
        }
    }
});

formTmpl.onDestroyed(function () {
    borrowingDocTem.set(null);
    borrowingId.set(null);
    paidDate.set(null);
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.borrowingPayById', currentData.borrowingPayId);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return BorrowingPayment.findOne(currentData.borrowingPayId);
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            let borrowingDoc = borrowingDocTem.get();
            if (borrowingDoc && borrowingDoc.currentDue) {
                doc.dueDoc = borrowingDoc.currentDue;
                doc.lastPaymentDoc = borrowingDoc.lastPaymentDoc;
            }

            return doc;
        }
    },
    onSuccess (formType, result) {
        displaySuccess();

        // Clear state
        borrowingDocTem.set(null);
        borrowingId.set(null);

        Meteor.setTimeout(()=> {
            $paidDate = $('[name="paidDate"]');
            paidDateAttachDTP($paidDate)
        }, 200);
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingPaymentForm'], hooksObject);

// Attach paid date to dateTimePicker
function paidDateAttachDTP(element) {
    paidDate.set(element.data('DateTimePicker').date());
    element.on("dp.change", (e)=> {
        paidDate.set(e.date);
    });
}