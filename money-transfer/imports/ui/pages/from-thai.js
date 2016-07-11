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
import {FromThai} from '../../api/collections/from-thai.js';

// Tabular
import {FromThaiTabular} from '../../../common/tabulars/from-thai.js';

// Page
import './from-thai.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_fromThai,
    actionTmpl = Template.MoneyTransfer_fromThaiAction,
    newTmpl = Template.MoneyTransfer_fromThaiNew,
    editTmpl = Template.MoneyTransfer_fromThaiEdit,
    showTmpl = Template.MoneyTransfer_fromThaiShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('fromThai', {size: ''});
    createNewAlertify('fromThaiShow',);

});

indexTmpl.helpers({
    tabularTable(){
        return FromThaiTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.fromThai(fa('plus', TAPi18n.__('moneyTransfer.fromThai.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.fromThai(fa('pencil', TAPi18n.__('moneyTransfer.fromThai.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            FromThai,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.fromThai.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.fromThaiShow(fa('eye', TAPi18n.__('moneyTransfer.fromThai.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return FromThai;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.fromThaiById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return FromThai;
    },
    data () {
        let data = FromThai.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.fromThaiById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.fromThai.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = FromThai.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.fromThai().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_fromThaiNew',
    'MoneyTransfer_fromThaiEdit'
], hooksObject);
