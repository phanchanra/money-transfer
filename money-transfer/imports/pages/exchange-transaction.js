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
import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});
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
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
// import {Product} from '../../common/collections/product';
// import {Customer} from '../../common/collections/customer';
// import {ExchangeRate} from '../../common/collections/exchange-rate';
// Tabular
import {ExchangeTransactionTabular} from '../../common/tabulars/exchange-transaction';
// Page
import './exchange-transaction.html';
// Declare template
let indexTmpl  = Template.MoneyTransfer_exchangeTransaction,
    actionTmpl = Template.MoneyTransfer_exchangeTransactionAction,
    newTmpl    = Template.MoneyTransfer_exchangeTransactionNew,
    editTmpl   = Template.MoneyTransfer_exchangeTransactionEdit,
    showTmpl   = Template.MoneyTransfer_exchangeTransactionShow;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('exchangeTransaction', {size: 'lg'});
    createNewAlertify('exchangeTransactionShow');

});

indexTmpl.helpers({
    tabularTable(){
        return ExchangeTransactionTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.exchangeTransaction(fa('plus', 'Exchange Transaction'), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.exchangeTransaction(fa('pencil', 'Exchange Transaction'), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            ExchangeTransaction,
            {_id: this._id},
            {title: 'Exchange Transaction', exchangeTransactionTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.exchangeTransactionShow(fa('eye', 'Exchange Transaction'), renderTemplate(showTmpl, this));
    },
});


// Insert

newTmpl.helpers({
    collection(){
        return ExchangeTransaction;
    }
});
newTmpl.events({
});
//Update
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.exchangeTransactionById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return ExchangeTransaction;
    },
    data () {
        let data = ExchangeTransaction.findOne(this._id);
        return data;
    }
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.exchangeTransactionById', this.data._id);
    });
});

showTmpl.helpers({
    data () {
        let data = ExchangeTransaction.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {

    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.exchangeTransaction().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);

    }
};
AutoForm.addHooks([
    'MoneyTransfer_exchangeTransactionNew',
    'MoneyTransfer_exchangeTransactionEdit'
], hooksObject);
function clearForm() {
    $('.convert-to').val('');
    $('.buying').val('');
    $('.selling').val('');
    $('.convert-amount').val('');
}
function calculateExchangeRate(baseCurrency, convertTo, amount, buying) {
    let convertAmount = {};
    if (baseCurrency == 'KHR') {
        convertAmount = new BigNumber(amount).times(new BigNumber(1).div(new BigNumber(buying))).toFixed(2);
    } else if (baseCurrency == 'USD') {
        convertAmount = new BigNumber(amount).times(new BigNumber(buying)).toFixed(2);
    } else {
        if (convertTo == 'KHR') {
            convertAmount = new BigNumber(amount).times(new BigNumber(buying)).toFixed();
        } else {
            convertAmount = new BigNumber(amount).times(new BigNumber(1).div(new BigNumber(buying))).toFixed(2);
        }
    }
    return convertAmount
}
