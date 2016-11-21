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
import {displaySuccess, displayError, displayWarning} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {Borrowing} from '../../common/collections/borrowing';
import {BorrowingPayment} from '../../common/collections/borrowingPayment';

// Tabular
import {BorrowingPaymentTabular} from '../../common/tabulars/borrowingPayment';

// Method
import {lookupBorrowingWithLastPayment} from '../../common/methods/lookupBorrowingWithLastPayment';
import {CalInterest} from '../../common/libs/calInterest';
import {getLastPaymentByBorrowing} from '../../common/methods/getLastBorrowingPayment';

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
    createNewAlertify('borrowingPayment');
    createNewAlertify('borrowingPaymentShow');

    // Get borrowing doc
    this.borrowingDoc = new ReactiveVar();
    this.autorun(()=> {
        let borrowingId = FlowRouter.getParam('borrowingId');
        let handle = this.subscribe('moneyTransfer.borrowingById', borrowingId);
        if (handle.ready()) {
            this.borrowingDoc.set(Borrowing.findOne(borrowingId));
        }
    });
});

indexTmpl.helpers({
    tabularTable(){
        return BorrowingPaymentTabular;
    },
    tabularSelector(){
        return {borrowingId: FlowRouter.getParam('borrowingId')};
    },
    data () {
        return Template.instance().borrowingDoc.get();
    },
    isActiveStatus(status){
        if (status == 'Active') {
            return true;
        }

        return false;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.borrowingPayment(fa('plus', 'Payment'), renderTemplate(formTmpl));
    },
    'click .js-destroy' (event, instance) {
        // Check status
        let borrowingDoc = instance.borrowingDoc.get();
        if (borrowingDoc.status == 'Reschedule') {
            displayWarning('Can not delete this, because borrowing status is [Reschedule]');
        } else {
            $.blockUI();

            // Check last
            getLastPaymentByBorrowing.callPromise({
                borrowingId: this.borrowingId
            }).then((result)=> {
                $.unblockUI();

                if (this._id != result._id) {
                    displayWarning('Can not delete this, because it\'s not last');
                } else {
                    destroyAction(
                        BorrowingPayment,
                        {_id: this._id},
                        {title: 'Payment', itemTitle: this._id}
                    );
                }
            }).catch((err)=> {
                    console.log(err.message);
                }
            );
        }
    },
    'click .js-display' (event, instance) {
        alertify.borrowingPaymentShow(fa('eye', 'Payment'), renderTemplate(showTmpl, {borrowingPaymentId: this._id}));
    },
    'click .js-invoice' (event, instance) {
        let params = {};
        let queryParams = {borrowingPaymentId: this._id};
        let path = FlowRouter.path("moneyTransfer.borrowingPaymentInvoiceReport", params, queryParams);

        window.open(path, '_blank');
    }
});

// Form
var borrowingDocWithLastPyamentState = new ReactiveVar();
var paidDateState = new ReactiveVar(null);

formTmpl.onCreated(function () {
});

formTmpl.onRendered(function () {
    let $paidDate = this.$('[name="paidDate"]');

    // Get default borrowing date
    paidDateAttachDTP($paidDate);

    // Tracker
    this.autorun(()=> {
        $.blockUI();

        // Get borrowing and last payment doc
        let borrowingId = FlowRouter.getParam('borrowingId');
        let _$paidDate = this.$('[name="paidDate"]');
        let params = {borrowingId: borrowingId};

        lookupBorrowingWithLastPayment.callPromise(params)
            .then((result)=> {
                // Set min of paid date
                let minPaidDate = moment(result.lastPaymentDoc.paidDate).startOf('day').toDate();
                _$paidDate.data('DateTimePicker').options({
                    minDate: minPaidDate,
                });

                console.log(result);

                borrowingDocWithLastPyamentState.set(result);

                $.unblockUI();
            }).catch((err)=> {
                console.log(err.message);
            }
        );

    });

});

formTmpl.helpers({
    collection(){
        return BorrowingPayment;
    },
    confirmData(){
        let borrowingDoc = borrowingDocWithLastPyamentState.get();

        if (borrowingDoc && paidDateState.get()) {
            let numOfDay = 0, currentInterest = 0, totalAmount = 0;

            // Cal num of day
            numOfDay = moment(paidDateState.get()).endOf('day').diff(moment(borrowingDoc.lastPaymentDoc.paidDate).startOf('day'), 'days');

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
    'blur [name="paidAmount"]'(event, instance){
        let totalDue = 0;
        let borrowingDoc = borrowingDocWithLastPyamentState.get();
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
    borrowingDocWithLastPyamentState.set(null);
    paidDateState.set(null);
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.borrowingPaymentById', currentData.borrowingPaymentId);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return BorrowingPayment.findOne(currentData.borrowingPaymentId);
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            let borrowingDoc = borrowingDocWithLastPyamentState.get();
            if (borrowingDoc && borrowingDoc.currentDue) {
                doc.dueDoc = borrowingDoc.currentDue;
                doc.lastPaymentDoc = borrowingDoc.lastPaymentDoc;
            }

            return doc;
        }
    },
    onSuccess (formType, result) {
        alertify.borrowingPayment().close();
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingPaymentForm'], hooksObject);

// Attach paid date to dateTimePicker
function paidDateAttachDTP(element) {
    paidDateState.set(element.data('DateTimePicker').date());
    element.on("dp.change", (e)=> {
        paidDateState.set(e.date);
    });
}