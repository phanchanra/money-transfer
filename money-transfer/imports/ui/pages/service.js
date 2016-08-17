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
import {Service} from '../../api/collections/service';

// Tabular
import {ServiceTabular} from '../../../common/tabulars/service';

// Page
import './service.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_service,
    actionTmpl = Template.MoneyTransfer_serviceAction,
    newTmpl = Template.MoneyTransfer_serviceNew,
    editTmpl = Template.MoneyTransfer_serviceEdit,
    showTmpl = Template.MoneyTransfer_serviceShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('service',);
    createNewAlertify('serviceShow',);

    // Reactive table filter
    // this.filter = new ReactiveTable.Filter('moneyTransfer.customerByBranchFilter', ['branchId']);
    // this.autorun(()=> {
    //     this.filter.set(Session.get('currentBranch'));
    // });
});

indexTmpl.helpers({
    tabularTable(){
        return ServiceTabular;
    }

});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.service(fa('plus', TAPi18n.__('moneyTransfer.service.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.service(fa('pencil', TAPi18n.__('moneyTransfer.service.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Service,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.service.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.serviceShow(fa('eye', TAPi18n.__('moneyTransfer.service.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Service;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.service', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return Service;
    },
    data () {
        let data = Service.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.service', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.service.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = Service.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.service().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_serviceNew',
    'MoneyTransfer_serviceEdit'
], hooksObject);
