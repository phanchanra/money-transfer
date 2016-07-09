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
import {ThaiBank} from '../../api/collections/thai-bank.js';

// Tabular
import {ThaiBankTabular} from '../../../common/tabulars/thai-bank.js';

// Page
import './thai-bank.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_thaiBank,
    actionTmpl = Template.MoneyTransfer_thaiBankAction,
    newTmpl = Template.MoneyTransfer_thaiBankNew,
    editTmpl = Template.MoneyTransfer_thaiBankEdit,
    showTmpl = Template.MoneyTransfer_thaiBankShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('thaiBank', {size: ''});
    createNewAlertify('thaiBankShow',);

});

indexTmpl.helpers({
    tabularTable(){
        return ThaiBankTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.thaiBank(fa('plus', TAPi18n.__('moneyTransfer.thaiBank.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.thaiBank(fa('pencil', TAPi18n.__('moneyTransfer.thaiBank.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            ThaiBank,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.thaiBank.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.thaiBankShow(fa('eye', TAPi18n.__('moneyTransfer.thaiBank.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return ThaiBank;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.thaiBankById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return ThaiBank;
    },
    data () {
        let data = ThaiBank.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.thaiBankById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.thaiBank.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = ThaiBank.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.thaiBank().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_thaiBankNew',
    'MoneyTransfer_thaiBankEdit'
], hooksObject);
