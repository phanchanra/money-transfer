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
import {ThaiService} from '../../api/collections/thai-service.js';

// Tabular
import {ThaiServiceTabular} from '../../../common/tabulars/thai-service.js';

// Page
import './thai-service.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_thaiService,
    actionTmpl = Template.MoneyTransfer_thaiServiceAction,
    newTmpl = Template.MoneyTransfer_thaiServiceNew,
    editTmpl = Template.MoneyTransfer_thaiServiceEdit,
    showTmpl = Template.MoneyTransfer_thaiServiceShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('thaiService', {size: ''});
    createNewAlertify('thaiServiceShow',);

});

indexTmpl.helpers({
    tabularTable(){
        return ThaiServiceTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.thaiService(fa('plus', TAPi18n.__('moneyTransfer.thaiService.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.thaiService(fa('pencil', TAPi18n.__('moneyTransfer.thaiService.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            ThaiService,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.thaiService.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.thaiServiceShow(fa('eye', TAPi18n.__('moneyTransfer.thaiService.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return ThaiService;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.thaiServiceById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return ThaiService;
    },
    data () {
        let data = ThaiService.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.thaiServiceById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.thaiService.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = ThaiService.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.thaiService().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_thaiServiceNew',
    'MoneyTransfer_thaiServiceEdit'
], hooksObject);
