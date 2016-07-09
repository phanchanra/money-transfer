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
import {Receiver} from '../../api/collections/receiver.js';

// Tabular
import {ReceiverTabular} from '../../../common/tabulars/receiver.js';

// Page
import './receiver.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_receiver,
    actionTmpl = Template.MoneyTransfer_receiverAction,
    newTmpl = Template.MoneyTransfer_receiverNew,
    editTmpl = Template.MoneyTransfer_receiverEdit,
    showTmpl = Template.MoneyTransfer_receiverShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('receiver', {size: 'lg'});
    createNewAlertify('receiverShow',);

    // Reactive table filter
    this.filter = new ReactiveTable.Filter('moneyTransfer.receiverByBranchFilter', ['branchId']);
    this.autorun(()=> {
        this.filter.set(Session.get('currentBranch'));
    });
});

indexTmpl.helpers({
    tabularTable(){
        return ReceiverTabular;
    }
    // selector() {
    //     return {branchId: Session.get('currentBranch')};
    // },
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.receiver(fa('plus', TAPi18n.__('moneyTransfer.receiver.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.receiver(fa('pencil', TAPi18n.__('moneyTransfer.receiver.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
          Receiver,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.receiver.title'), itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.receiverShow(fa('eye', TAPi18n.__('moneyTransfer.receiver.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Receiver;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.receiverById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return Receiver;
    },
    data () {
        let data = Receiver.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.receiverById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.receiver.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = Receiver.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.receiver().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_receiverNew',
    'MoneyTransfer_receiverEdit'
], hooksObject);
