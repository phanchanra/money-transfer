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
import {Transfer} from '../../api/collections/transfer';

// Tabular
import {TransferTabular} from '../../../common/tabulars/transfer';
//function
// import {calculateIncome} from '../../../common/globalState/calculateIncome'
// Page
import './transfer.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_transfer,
    actionTmpl = Template.MoneyTransfer_transferAction,
    formTmpl = Template.MoneyTransfer_transferForm,
    showTmpl = Template.MoneyTransfer_transferShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('transfer', {size: 'lg'});
    createNewAlertify('transferShow');
});

indexTmpl.helpers({
    tabularTable(){
        return TransferTabular;
    },
    senderPhone(){
        return Template.instance().senderPhone.get();
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.transfer(fa('plus', 'Transfer'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.transfer(fa('pencil', 'Transfer'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Transfer,
            {_id: this._id},
            {title: 'Transfer', transferTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.transferShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.transferById', currentData._id);
        }
    });
    this.senderPhone = new ReactiveVar();

});

formTmpl.helpers({
    collection(){
        return Transfer;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Transfer.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }
});
formTmpl.events({
    'change [name="senderId"]'(e, instance){
        let senderId = $(e.currentTarget).val();
        Meteor.call("getCustomerInfo", senderId, function (error, result) {
            instance.$('[name="senderTelephone"]').val(result);
            // instance.senderPhone.set(result);
        });
    },
    'change [name="receiverId"]'(e, instance){
        let receiverId = $(e.currentTarget).val();
        Meteor.call("getCustomerInfo", receiverId, function (error, result) {
            instance.$('[name="receiverTelephone"]').val(result);
        });
    }
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.transferById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Transfer.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.transfer().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_transferForm'], hooksObject);
