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
import {createNewAlertify} from '../../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/column-action.js';
import '../../../../core/client/components/form-footer.js';

// Collection
import {Sender} from '../../api/collections/sender.js';

// Tabular
import {SenderTabular} from '../../../common/tabulars/sender.js';

// Page
import './sender.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_sender,
    actionTmpl = Template.MoneyTransfer_senderAction,
    newTmpl = Template.MoneyTransfer_senderNew,
    editTmpl = Template.MoneyTransfer_senderEdit,
    showTmpl = Template.MoneyTransfer_senderShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('sender', {size: 'lg'});
    createNewAlertify('senderShow',);

    // Reactive table filter
    this.filter = new ReactiveTable.Filter('moneyTransfer.senderByBranchFilter', ['branchId']);
    this.autorun(()=> {
        this.filter.set(Session.get('currentBranch'));
    });
});

indexTmpl.helpers({
    tabularTable(){
        return SenderTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.sender(fa('plus', TAPi18n.__('moneyTransfer.sender.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.sender(fa('pencil', TAPi18n.__('moneyTransfer.sender.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Sender,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.sender.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.senderShow(fa('eye', TAPi18n.__('moneyTransfer.sender.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Sender;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.senderById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return Sender;
    },
    data () {
        let data = Sender.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.senderById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.sender.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = Sender.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.sender().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_senderNew',
    'MoneyTransfer_senderEdit'
], hooksObject);
