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

// Tabular
import {BorrowingTabular} from '../../common/tabulars/borrowing';

// Method
import {lookupBorrowingWithLastPayment} from '../../common/methods/lookupBorrowingWithLastPayment';

// Page
import './borrowing.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_borrowing,
    actionTmpl = Template.MoneyTransfer_borrowingAction,
    statusActionTmpl = Template.MoneyTransfer_borrowingStatusAction,
    formTmpl = Template.MoneyTransfer_borrowingForm,
    rescheduleFormTmpl = Template.MoneyTransfer_borrowingRescheduleForm,
    activeStatusFormTmpl = Template.MoneyTransfer_borrowingActiveStatusForm,
    showTmpl = Template.MoneyTransfer_borrowingShow;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('borrowing', {size: 'lg'});
    createNewAlertify(['borrowStatus', 'borrowingShow']);
});

indexTmpl.helpers({
    tabularTable(){
        return BorrowingTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.borrowing(fa('plus', 'Borrowing'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        // Check status
        if (this.status == 'Inactive') {
            alertify.borrowing(fa('pencil', 'Borrowing'), renderTemplate(formTmpl, {borrowingId: this._id}));
        } else {
            displayWarning('This doc can not update');
        }
    },
    'click .js-destroy' (event, instance) {
        // Check status
        // if (this.status == 'Inactive') {
            destroyAction(
                Borrowing,
                {_id: this._id},
                {title: 'Borrowing', itemTitle: this._id}
            );
        // } else {
        //     displayWarning('This doc can not delete');
        // }
    },
    'click .js-display' (event, instance) {
        alertify.borrowingShow(fa('eye', 'Borrowing'), renderTemplate(showTmpl, {borrowingId: this._id}));
    },
    'click .js-invoice' (event, instance) {
        let params = {};
        let queryParams = {borrowingId: this._id};
        let path = FlowRouter.path("moneyTransfer.borrowingInvoiceReport", params, queryParams);

        window.open(path, '_blank');
    },
    'click .js-status' (event, instance) {
        if (this.status == 'Inactive') {
            alertify.borrowing(fa('pencil', 'Active Status'), renderTemplate(activeStatusFormTmpl, {borrowingId: this._id}));
        } else if (this.status == 'Active') {
            Session.set('disableCustomerId', true);

            alertify.borrowing(fa('pencil', 'Borrowing (Reschedule)'), renderTemplate(rescheduleFormTmpl, {borrowingId: this._id}));
        } else {
            displayWarning('This doc can not change [Status]');
        }
    },
});

// Status Action
statusActionTmpl.helpers({
    statusAttr(){
        let className = 'btn-default';

        if (this.status == 'Active') {
            className = 'btn-primary';
        } else if (this.status == 'Reschedule') {
            className = 'btn-warning';
        } else if (this.status == 'Close') {
            className = 'btn-danger';
        }

        return className;
    }
});

// Form
var borrowingDate = new ReactiveVar(null);
var term = new ReactiveVar(0);

formTmpl.onCreated(function () {

    this.autorun(()=> {
        // Check for update form
        let currentData = Template.currentData();
        if (currentData) {
            $.blockUI();

            const handle = this.subscribe('moneyTransfer.borrowingById', currentData.borrowingId);
            if (handle.ready()) {
                let borrowingDoc = Borrowing.findOne({_id: currentData.borrowingId});
                borrowingDate.set(borrowingDoc.borrowingDate);
                term.set(borrowingDoc.term);

                Meteor.setTimeout(function () {
                    $.unblockUI();
                }, 200);
            }
        }
    });

});

formTmpl.onRendered(function () {
    let $borrowingDate = this.$('[name="borrowingDate"]');
    borrowingDateAttachDTP($borrowingDate);

    // Tracker
    this.autorun(()=> {
        let $maturityDate = this.$('[name="maturityDate"]');

        // Cal maturity date
        let maturityDate = null, minMaturityDate = false, maxMaturityDate = false;

        if (borrowingDate.get() && term.get()) {
            maturityDate = moment(borrowingDate.get()).add(term.get(), 'months').toDate();
            minMaturityDate = moment(maturityDate).startOf('month').toDate();
            maxMaturityDate = moment(maturityDate).endOf('month').toDate();

            //Set maturity date
            $maturityDate.data('DateTimePicker').options({
                minDate: minMaturityDate,
                maxDate: maxMaturityDate
            });
            $maturityDate.data('DateTimePicker').date(maturityDate);
        }

    });

});

formTmpl.helpers({
    collection(){
        return Borrowing;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Borrowing.findOne({_id: currentData.borrowingId});
            data.type = 'update';
        }

        return data;
    }
});

formTmpl.events({
    'keyup [name="term"]'(event, instance){
        term.set(event.currentTarget.value);
    }
});

formTmpl.onDestroyed(function () {
    borrowingDate.set(null);
    term.set(0);
});

// Reschedule Form
rescheduleFormTmpl.onCreated(function () {
    this.borrowingDoc = new ReactiveVar();

    $.blockUI();
    this.autorun(()=> {
        let currentData = Template.currentData();
        let params = {borrowingId: currentData.borrowingId};
        lookupBorrowingWithLastPayment.callPromise(params)
            .then((result)=> {
                this.borrowingDoc.set(result);

                // Check borrowing date
                let _$borrowingDate = this.$('[name="borrowingDate"]');
                _$borrowingDate.data('DateTimePicker').options({
                    minDate: moment(result.lastPaymentDoc.paidDate).startOf('day').toDate(),
                });
                borrowingDate.set(result.lastPaymentDoc.paidDate);
                term.set(result.term);

                Meteor.setTimeout(()=> {
                    $.unblockUI();
                }, 200)
            }).catch((err)=> {
                console.log(err.message);
            }
        );

    });

});

rescheduleFormTmpl.onRendered(function () {
    let $borrowingDate = this.$('[name="borrowingDate"]');
    $borrowingDate.on("dp.change", (e)=> {
        borrowingDate.set(e.date);
    });

    // Tracker
    this.autorun(()=> {
        // Cal maturity date
        let $maturityDate = this.$('[name="maturityDate"]');
        let maturityDate = null, minMaturityDate = false, maxMaturityDate = false;

        if (borrowingDate.get() && term.get()) {
            maturityDate = moment(borrowingDate.get()).add(term.get(), 'months').toDate();
            minMaturityDate = moment(maturityDate).startOf('month').toDate();
            maxMaturityDate = moment(maturityDate).endOf('month').toDate();

            //Set maturity date
            $maturityDate.data('DateTimePicker').options({
                minDate: minMaturityDate,
                maxDate: maxMaturityDate
            });
            $maturityDate.data('DateTimePicker').date(maturityDate);
        }
    });

});

rescheduleFormTmpl.helpers({
    collection(){
        return Borrowing;
    },
    data(){
        let data = Template.instance().borrowingDoc.get();
        if (data) {
            data.totalDue = data.lastPaymentDoc.balanceDoc.principal + data.lastPaymentDoc.balanceDoc.interest;
        }

        return data;
    }
});

rescheduleFormTmpl.events({
    'keyup [name="term"]'(event, instance){
        term.set(event.currentTarget.value);
    }
});

rescheduleFormTmpl.onDestroyed(function () {
    borrowingDate.set(null);
    term.set(0);
    Session.set('disableCustomerId', false);
});

// Active Status Form
activeStatusFormTmpl.onCreated(function () {
    this.borrowingDoc = new ReactiveVar();
});

activeStatusFormTmpl.onRendered(function () {
    // Tracker
    this.autorun(()=> {
        $.blockUI();

        let currentData = Template.currentData();
        let params = {borrowingId: currentData.borrowingId};
        lookupBorrowingWithLastPayment.callPromise(params)
            .then((result)=> {
                this.borrowingDoc.set(result);

                let $activeDate = this.$('[name="activeDate"]');
                $activeDate.data('DateTimePicker').options({
                    minDate: moment(result.borrowingDate).startOf('day').toDate(),
                });

                Meteor.setTimeout(()=> {
                    $.unblockUI();
                }, 200)
            }).catch((err)=> {
                console.log(err.message);
            }
        );

    });
});

activeStatusFormTmpl.helpers({
    collection(){
        return Borrowing;
    },
    data () {
        return Template.instance().borrowingDoc.get();
    }
});

// Show
showTmpl.onCreated(function () {
    this.borrowingDoc = new ReactiveVar();

    this.autorun(()=> {
        $.blockUI();

        let currentData = Template.currentData();
        let params = {borrowingId: currentData.borrowingId};
        lookupBorrowingWithLastPayment.callPromise(params)
            .then((result)=> {
                this.borrowingDoc.set(result);

                $.unblockUI();
            }).catch((err)=> {
                console.log(err.message);
            }
        );
    });
});

showTmpl.helpers({
    data () {
        return Template.instance().borrowingDoc.get();
    }
});

// Form Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            doc.borrowingType = 'GR';
            doc.status = 'Inactive';
            return doc;
        }
    },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.borrowing().close();
        }
        displaySuccess();

        // Clear state
        borrowingDate.set(null);
        term.set(0);

        // Date change
        if (formType == 'insert') {
            Meteor.setTimeout(()=> {
                let $borrowingDate = $('[name="borrowingDate"]');
                borrowingDateAttachDTP($borrowingDate);
            }, 200);
        }

    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingForm'], hooksObject);

// Reschedule Form Hook
let rescheduleHooksObject = {
    before: {
        insert: function (doc) {
            doc.borrowingType = 'RS';
            doc.status = 'Inactive';
            return doc;
        }
    },
    onSuccess (formType, result) {
        alertify.borrowing().close();
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingRescheduleForm'], rescheduleHooksObject);

// Active Status Form Hook
let activeStatusHooksObject = {
    onSuccess (formType, result) {
        alertify.borrowing().close();
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingActiveStatusForm'], activeStatusHooksObject);


// Attach dateTimePicket to borrowingDate
function borrowingDateAttachDTP($element) {
    borrowingDate.set($element.data('DateTimePicker').date());

    $element.on("dp.change", (e)=> {
        console.log('borrowingDate is changed');
        borrowingDate.set(e.date);
    });
}