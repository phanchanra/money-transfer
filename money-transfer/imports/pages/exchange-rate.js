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
import {ExchangeRate} from '../../common/collections/exchange-rate';
import {Product} from '../../common/collections/product';
// Tabular
import {ExchangeRateTabular} from '../../common/tabulars/exchange-rate';
// Page
import './exchange-rate.html';
// Declare template
let indexTmpl = Template.MoneyTransfer_exchangeRate,
    actionTmpl = Template.MoneyTransfer_exchangeRateAction,
    productTmpl = Template.MoneyTransfer_exchangeRateProductShow,
    formTmpl = Template.MoneyTransfer_exchangeRateForm,
    showTmpl = Template.MoneyTransfer_exchangeRateShow;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('exchangeRate', {size: 'lg'});
    createNewAlertify('exchangeRateShow');

});

indexTmpl.helpers({
    tabularTable(){
        return ExchangeRateTabular;
    }
});
indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.exchangeRate(fa('plus', 'Exchange Rate'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.exchangeRate(fa('pencil', 'Exchange Rate'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            ExchangeRate,
            {_id: this._id},
            {title: 'Exchange Rate', exchangeRateTitle: this._id}
        );
        // let id = this._id;
        // Meteor.call('productFeeExist', this.productId, this.currencyId, function (error, result) {
        //     if (result) {
        //         swal("Sorry can not remove", "This product fee is already used!");
        //     } else {
        //         destroyAction(
        //             exchangeRate,
        //             {_id: id},
        //             {title: 'Exchange Rate', exchangeRateTitle: id}
        //         );
        //     }
        // });
    },
    'click .js-display' (event, instance) {
        alertify.exchangeRateShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    },
    'click .js-display-product' (event, instance) {
        Meteor.call("getProduct", this.productId, function (error, result) {
            alertify.exchangeRateShow(fa('eye', 'Product'), renderTemplate(productTmpl, result));
        });
    },
});


// Form
// formTmpl.onRendered(function () {
// });

formTmpl.onCreated(function () {
    Session.set("baseCurrency", 'USD');
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.exchangeRateById', currentData._id);
        }
    });
});
// serviceTmpl.onCreated(function () {
//     this.state = new ReactiveVar();
// });
//helper
formTmpl.helpers({
    collection(){
        return ExchangeRate;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = ExchangeRate.findOne({_id: currentData._id});
            data.type = 'update';
        }
        return data;
    }

});
formTmpl.events({
    'click [name="baseCurrency"]'(e, instance){
        let baseCurrency = $(e.currentTarget).val();
        //let currencySymbol = $(e.currentTarget).val();
        let symbol;
        if (baseCurrency == 'USD') {
            symbol = '$'
        } else if (baseCurrency == 'KHR') {
            symbol = '៛'
        } else {
            symbol = 'B'
        }
        Session.set("baseCurrency", baseCurrency);
        Session.set("currencySymbol", symbol);
        //clear
        clearForm();
    },
    'change .amount,.convert-to,.buying'(e, instance){
        let currentObj = $(e.currentTarget);
        let parentsObj = currentObj.parents('.exchange-rate');
        let amount     = parentsObj.find('.amount').val();
        let convertTo  = parentsObj.find('.convert-to').val();
        let buying     = parentsObj.find('.buying').val();

        if (amount > 0) {
            parentsObj.find('.convert-to').prop("disabled", false);
        } else {
            parentsObj.find('.convert-to').prop("disabled", true);
        }
        if (convertTo != '') {
            parentsObj.find('.buying').prop("readonly", false);

        } else {
            parentsObj.find('.buying').prop("readonly", true);
        }
        if (buying > 0) {
            parentsObj.find('.selling').prop("readonly", false);
        } else {
            parentsObj.find('.selling').prop("readonly", true);
        }
        parentsObj.find('.convert-amount').val(calculateExchangeRate(Session.get("baseCurrency"), convertTo, amount, buying));
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.exchangeRateById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return ExchangeRate.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {

    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.exchangeRate().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);

    }
};

AutoForm.addHooks(['MoneyTransfer_exchangeRateForm'], hooksObject);
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
// if (Session.get("baseCurrency") == 'KHR') {
//     let convertAmount = new BigNumber(amount).times(new BigNumber(1).div(new BigNumber(buying))).toFixed(2);
//     if (convertTo == 'USD') {
//         currentObj.parents('.exchange-rate').find('.convert-amount').val(convertAmount);
//     } else {
//         currentObj.parents('.exchange-rate').find('.convert-amount').val(convertAmount);
//     }
// } else if (Session.get("baseCurrency") == 'THB') {
//     if (convertTo == 'KHR') {
//         let convertAmount = new BigNumber(amount).times(new BigNumber(buying)).toFixed();
//         currentObj.parents('.exchange-rate').find('.convert-amount').val(convertAmount);
//     } else {
//         let convertAmount = new BigNumber(amount).times(new BigNumber(1).div(new BigNumber(buying))).toFixed(2);
//         currentObj.parents('.exchange-rate').find('.convert-amount').val(convertAmount);
//     }
// } else {
//     let convertAmount = new BigNumber(amount).times(new BigNumber(buying)).toFixed(2);
//     currentObj.parents('.exchange-rate').find('.convert-amount').val(convertAmount);
// }