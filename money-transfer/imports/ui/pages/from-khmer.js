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
import {FromKhmer} from '../../api/collections/from-khmer.js';

// Tabular
import {FromKhmerTabular} from '../../../common/tabulars/from-khmer.js';

// Page
import './from-khmer.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_fromKhmer,
    actionTmpl = Template.MoneyTransfer_fromKhmerAction,
    newTmpl = Template.MoneyTransfer_fromKhmerNew,
    editTmpl = Template.MoneyTransfer_fromKhmerEdit,
    showTmpl = Template.MoneyTransfer_fromKhmerShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('fromKhmer', {size: 'lg'});
    createNewAlertify('fromKhmerShow',);

});

indexTmpl.helpers({
    tabularTable(){
        return FromKhmerTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.fromKhmer(fa('plus', TAPi18n.__('moneyTransfer.fromKhmer.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.fromKhmer(fa('pencil', TAPi18n.__('moneyTransfer.fromKhmer.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            FromKhmer,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.fromKhmer.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.fromKhmerShow(fa('eye', TAPi18n.__('moneyTransfer.fromKhmer.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return FromKhmer;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.fromKhmerById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return FromKhmer;
    },
    data () {
        let data = FromKhmer.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.fromKhmerById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.fromKhmer.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = FromKhmer.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.fromKhmer().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_fromKhmerNew',
    'MoneyTransfer_fromKhmerEdit'
], hooksObject);
