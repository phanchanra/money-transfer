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
import {Fee} from '../../api/collections/fee';

// Tabular
import {FeeTabular} from '../../../common/tabulars/fee';
//function
import {calculateAgentFee} from '../../../common/globalState/calculateAgentFee'
// Page
import './fee.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_fee,
    actionTmpl = Template.MoneyTransfer_feeAction,
    formTmpl = Template.MoneyTransfer_feeForm,
    showTmpl = Template.MoneyTransfer_feeShow,
    serviceTmpl=Template.customObjectFieldForService;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('fee', {size: 'lg'});
    createNewAlertify('feeShow');
});

indexTmpl.helpers({
    tabularTable(){
        return FeeTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.fee(fa('plus', 'Fee'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.fee(fa('pencil', 'Fee'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Fee,
            {_id: this._id},
            {title: 'Fee', feeTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.feeShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    }
});
// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.feeById', currentData._id);
        }
    });
});
serviceTmpl.onCreated(function () {
    this.state = new ReactiveVar(0);
});
//helper
formTmpl.helpers({
    collection(){
        return Fee;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Fee.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }

});
serviceTmpl.helpers({
    agentFee(){
        const agentFee = Template.instance();
        return agentFee.state.get();
    }
});


formTmpl.onRendered(function () {
    Session.set("currencySymbol", "$");
});
formTmpl.events({
    'click [name="currencyId"]'(e, instance){
        let currencySymbol = $(e.currentTarget).val();
        let symbol;
        if (currencySymbol == 'USD') {
            symbol = '$'
        } else if (currencySymbol == 'KHR') {
            symbol = '៛'
        } else {
            symbol = 'B'
        }
        Session.set("currencySymbol", symbol);
    }
});
serviceTmpl.events({
    'keyup [name="ownerFee"]'(e, instance){
        alert("he");
    },
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.feeById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Fee.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.fee().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_feeForm'], hooksObject);
