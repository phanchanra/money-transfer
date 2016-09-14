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
import {Borrowing} from '../../common/collections/borrowing';

// Tabular
import {BorrowingTabular} from '../../common/tabulars/borrowing';

// Page
import './borrowing.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_borrowing,
    actionTmpl = Template.MoneyTransfer_borrowingAction,
    formTmpl = Template.MoneyTransfer_borrowingForm,
    showTmpl = Template.MoneyTransfer_borrowingShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('borrowing', {size: 'lg'});
    createNewAlertify('borrowingShow');
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
        alertify.borrowing(fa('pencil', 'Borrowing'), renderTemplate(formTmpl, {borrowingId: this._id}));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Borrowing,
            {_id: this._id},
            {title: 'Borrowing', borrowingTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.borrowingShow(fa('eye', 'Borrowing'), renderTemplate(showTmpl, {borrowingId: this._id}));
    }
});

// Form
formTmpl.onCreated(function () {
    this.borrowingDate = new ReactiveVar(null);
    this.term = new ReactiveVar(0);

    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.borrowingById', currentData.borrowingId);
        }

    });
});

formTmpl.onRendered(function () {
    let $borrowingDate = this.$('[name="borrowingDate"]');
    let $maturityDate = this.$('[name="maturityDate"]');

    // Get default borrowing date
    this.borrowingDate.set($borrowingDate.data('DateTimePicker').date());

    // Tracker
    this.autorun(()=> {
        let maturityDate = null, minMaturityDate = false, maxMaturityDate = false;

        if (this.borrowingDate.get() && this.term.get()) {
            maturityDate = moment(this.borrowingDate.get()).add(this.term.get(), 'months').toDate();
            minMaturityDate = moment(maturityDate).startOf('month').toDate();
            maxMaturityDate = moment(maturityDate).endOf('month').toDate();
        }

        // Set maturity date
        $maturityDate.data('DateTimePicker').options({
            minDate: minMaturityDate,
            maxDate: maxMaturityDate
        });
        $maturityDate.data('DateTimePicker').date(maturityDate);
    });

    // Date change
    $borrowingDate.on("dp.change", (e)=> {
        this.borrowingDate.set(e.date);
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
        instance.term.set(event.currentTarget.value);
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.borrowingById', currentData.borrowingId);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Borrowing.findOne(currentData.borrowingId);
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            return doc;
        },
        update: function (doc) {
            return doc;
        }
    },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.borrowing().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_borrowingForm'], hooksObject);
