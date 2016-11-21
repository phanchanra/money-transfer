import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {_} from 'meteor/erasaur:meteor-lodash';
import {$} from 'meteor/jquery';
import {TAPi18n} from 'meteor/tap:i18n';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';
import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});
// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Method
//import {lookupItem} from '../../common/methods/lookup-item.js';

// Collection
import {TransactionItemsSchema} from '../../common/collections/transaction-items';
import {ExchangeRate} from '../../common/collections/exchange-rate';

// Page
import './transaction-items.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_transactionItems,
    actionTmpl = Template.MoneyTransfer_transactionItemsAction,
    newTmpl = Template.MoneyTransfer_transactionItemsNew,
    editTmpl = Template.MoneyTransfer_transactionItemsEdit;

// Local collection
let itemsCollection;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('item');

    // Data context
    let data = Template.currentData();
    itemsCollection = data.itemsCollection;
});

indexTmpl.helpers({
    tableSettings: function () {
        let i18nPrefix = 'moneyTransfer.exchangeTransaction.schema';
        reactiveTableSettings.showFilter = false;
        reactiveTableSettings.showNavigation = 'never';
        reactiveTableSettings.showColumnToggles = false;
        reactiveTableSettings.collection = itemsCollection;
        reactiveTableSettings.fields = [
            {
                key: 'baseCurrency',
                label: 'Base Currency',
                fn(value, obj, key){
                    return Spacebars.SafeString(`<span class="base-currency">${value}</span>`)
                }
            },
            {
                key: 'convertTo',
                label: 'Convert To',
                fn(value, obj, key){
                    return Spacebars.SafeString(`<span class="convert-to">${value}</span>`);
                }
            },
            {
                key: 'baseAmount',
                label: 'Base Amount',
                fn(value, obj, key){
                    return Spacebars.SafeString(`<input type="text" value="${value}" class="base-amount" readonly="readonly">`);
                }
            },
            // {
            //     key: 'toAmountBuying',
            //     label: 'រឹរ',
            //     fn (value, object, key) {
            //         return Spacebars.SafeString(`<input type="text" value="${numeral(value).format('0,0.00')}" class="to-amount-buying">`);
            //         //return Spacebars.SafeString(`<span class="to-amount">${numeral(value).format('0,0.00')}</span>`);
            //     }
            // },
            {
                key: 'toAmount',
                label: 'To Amount',
                fn (value, object, key) {
                    //return numeral(value).format('0,0.00');
                    return Spacebars.SafeString(`<span class="to-amount">${numeral(value).format('0,0.00')}</span>`);
                }
            },
            {
                key: '_id',
                label(){
                    return fa('bars', '', true);
                },
                headerClass: function () {
                    let css = 'text-center col-action-order-item';
                    return css;
                },
                tmpl: actionTmpl, sortable: false
            }
        ];
        return reactiveTableSettings;
    }
});
let state = new ReactiveObj({
    buyingRate: 0,
    sellingRate: 0,
    toAmountBuying: 0,
    toAmount: 0,
    income: 0
});
indexTmpl.events({
    'click .js-update-item': function (event, instance) {
        alertify.item(fa('pencil', 'Transaction Item'), renderTemplate(editTmpl, this));
    },
    'click .js-destroy-item': function (event, instance) {
        destroyAction(
            itemsCollection,
            {_id: this._id},
            {title: 'Transaction Item', itemTitle: this.exchangeTransaction}
        );
    },
    'keyup .base-amount'(event, instance){
        let $parents = $(event.currentTarget).parents('tr');
        let baseCurrency = $parents.find('.base-currency').text();
        let convertTo = $parents.find('.convert-to').text();
        let baseAmount = $parents.find('.base-amount').val();
        baseAmount = _.isEmpty(baseAmount) ? 0 : parseFloat(baseAmount);
        if (baseCurrency && convertTo && baseAmount) {
            Meteor.call("calculateExchangeRateSelling", baseCurrency, convertTo, baseAmount, function (error, result) {
                $parents.find('.to-amount-buying').val(result.buying);
                $parents.find('.to-amount').val(result.selling);
            });
        }
    },
    'blur .base-amount': function (event, instance) {
        let $parents = $(event.currentTarget).parents('tr');
        let baseCurrency = $parents.find('.base-currency').text();
        let convertTo = $parents.find('.convert-to').text();
        let baseAmount = $parents.find('.base-amount').val();
        baseAmount = _.isEmpty(baseAmount) ? 0 : parseFloat(baseAmount);
        if (baseCurrency && convertTo && baseAmount) {
            Meteor.call("calculateExchangeRateSelling", baseCurrency, convertTo, baseAmount, function (error, result) {
                itemsCollection.update(
                    {baseCurrency: baseCurrency, convertTo: convertTo},
                    {$set: {baseAmount: baseAmount, toAmountBuying: result.buying, toAmount: result.selling}}
                );
            });
        }
    }
});

// New
newTmpl.onCreated(function () {
    // State
    //this.baseCurrency = new ReactiveVar();
    //this.convertTo = new ReactiveVar();
    //this.baseAmount = new ReactiveVar(0);
    //this.toAmount = new ReactiveVar();
});

newTmpl.helpers({
    schema(){
        return TransactionItemsSchema;
    },
    disabledAddItemBtn: function () {
        //const instance = Template.instance();
        if (state.get('toAmount') > 0) {
            return {};
        }
        return {disabled: true};
    },
    baseExchangeShow(){
        let getBaseCurrency = Session.get("baseCurrency");
        let baseCur = {};
        if (getBaseCurrency) {
            if (getBaseCurrency == "USD") {
                baseCur = 1 + "USD";
            } else if (getBaseCurrency == "KHR") {
                baseCur = 1 + "KHR";
            } else if (getBaseCurrency == "THB") {
                baseCur = 1 + "THB";
            }
            return baseCur;
        }
    },
    exchangeRateSelling(){
        return state.get("sellingRate");
    },
    exchangeRateBuying(){
        return state.get("buyingRate");
    },
    toAmountBuying(){
        return state.get("toAmountBuying");
    },
    toAmount(){
        return state.get('toAmount');
    },
    income(){
        return state.get('income');
    }
});

newTmpl.events({
    'change .base-currency'(e, instance){
        let baseCurrency = $(e.currentTarget).val();

        let baseCurrencySymbol;
        if (baseCurrency == 'USD') {
            baseCurrencySymbol = '$'
        } else if (baseCurrency == 'KHR') {
            baseCurrencySymbol = '៛'
        } else {
            baseCurrencySymbol = 'B'
        }
        // UIBlock.block('Wait...');
        $.blockUI();
        Meteor.setTimeout(()=> {
            // UIBlock.unblock();
            Session.set("baseCurrency", baseCurrency);
            Session.set("baseCurrencySymbol", baseCurrencySymbol);
            //clear
            //clearForm();
            $.unblockUI();
        }, 200);
    },
    'change .convert-to'(e, instance){
        //let baseAmount = instance.$('[name="baseAmount"]').val();
        let baseCurrency = instance.$('[name="baseCurrency"]').val();
        let convertTo = instance.$('[name="convertTo"]').val();
        let convertToSymbol;
        if (convertTo == 'USD') {
            convertToSymbol = '$'
        } else if (convertTo == 'KHR') {
            convertToSymbol = '៛'
        } else {
            convertToSymbol = 'B'
        }
        Session.set("convertToSymbol", convertToSymbol);

        if (baseCurrency && convertTo) {
            Meteor.call("exchangeItemsLabel", baseCurrency, convertTo, function (err, res) {
                state.set('buyingRate', res.exBuyingRate);
                state.set('sellingRate', res.exSellingRate);
                // Session.set("exchangeRateLabelOnHelper", res.exSellingRate);
            });
        }

    },
    'keyup .base-amount'(e, instance){
        let baseAmount = $(e.currentTarget).val();
        let baseCurrency = instance.$('[name="baseCurrency"]').val();
        let convertTo = instance.$('[name="convertTo"]').val();
        if (baseCurrency && convertTo && baseAmount) {
            Meteor.call("calculateExchangeRateSelling", baseCurrency, convertTo, baseAmount, function (error, result) {
                if (!result) {
                    clear();
                    swal("Please check", "Your exchange rate are not yet data Entry!");
                } else {
                    let income = new BigNumber(result.selling).minus(new BigNumber(result.buying)).toFixed(2);
                    state.set('toAmountBuying', result.buying);
                    state.set('toAmount', result.selling);
                    state.set('income', income);
                }
            });
        }
    },
    'click .js-add-item': function (event, instance) {
        let baseCurrency = instance.$('[name="baseCurrency"]').val();
        let convertTo = instance.$('[name="convertTo"]').val();
        let baseAmount = math.round(parseFloat(instance.$('[name="baseAmount"]').val()), 2);
        let buying = instance.$('[name="buying"]').val();
        let selling = instance.$('[name="selling"]').val();
        let toAmountBuying = math.round(parseFloat(instance.$('[name="toAmountBuying"]').val()), 2);
        let toAmount = math.round(parseFloat(instance.$('[name="toAmount"]').val()), 2);
        let income = math.round(parseFloat(instance.$('[name="income"]').val()), 2);

        clearFrom();
        Session.set("baseCurrencySymbol", false);
        Session.set("convertToSymbol", false);
        // Check exist
        let exist = itemsCollection.findOne({baseCurrency: baseCurrency, convertTo: convertTo});
        if (exist) {
            baseAmount += parseFloat(exist.baseAmount);
            toAmountBuying += parseFloat(exist.toAmountBuying);
            toAmount += parseFloat(exist.toAmount);
            income += parseFloat(exist.income);
            itemsCollection.update(
                {baseCurrency: baseCurrency, convertTo: convertTo},
                {$set: {baseAmount: baseAmount, toAmountBuying: toAmountBuying, toAmount: toAmount, income: income}}
            );
        } else {
            itemsCollection.insert({
                baseCurrency: baseCurrency,
                buying: buying,
                selling: selling,
                convertTo: convertTo,
                baseAmount: baseAmount,
                toAmountBuying: toAmountBuying,
                toAmount: toAmount,
                income: income
            });
        }
        state.set('toAmount', 0);
        state.set('toAmountBuying', 0);
        state.set('buyingRate', 0);
        state.set('sellingRate', 0);
    },
});

// Edit
editTmpl.onCreated(function () {
    this.toAmount = new ReactiveVar(0);
    this.autorun(()=> {
        let data = Template.currentData();
        this.toAmount.set(data.toAmount);
    });
});
//
editTmpl.helpers({
    schema(){
        return TransactionItemsSchema;
    },
    data: function () {
        let data = Template.currentData();
        return data;
    },
    // toAmount: function () {
    //     const instance = Template.instance();
    //     return instance.toAmount.get();
    // }
    toAmountBuying(){
        return state.get("toAmountBuying");
    },
    toAmount(){
        return state.get('toAmount');
    }
});
//
// editTmpl.events({
//     'change [name="baseCurrency"]'(e, instance){
//         let baseCurrency = $(e.currentTarget).val();
//         clear();
//         let baseCurrencySymbol;
//         if (baseCurrency == 'USD') {
//             baseCurrencySymbol = '$'
//         } else if (baseCurrency == 'KHR') {
//             baseCurrencySymbol = '៛'
//         } else {
//             baseCurrencySymbol = 'B'
//         }
//         Session.set("baseCurrency", baseCurrency);
//         Session.set("baseCurrencySymbol", baseCurrencySymbol);
//     },
//     // 'change [name="convertTo"],[name="baseAmount"]'(e, instance){
//     //     let baseAmount = instance.$('[name="baseAmount"]').val();
//     //     let baseCurrency = instance.$('[name="baseCurrency"]').val();
//     //     let convertTo = instance.$('[name="convertTo"]').val();
//     //
//     //     let convertToSymbol;
//     //     if (convertTo == 'USD') {
//     //         convertToSymbol = '$'
//     //     } else if (convertTo == 'KHR') {
//     //         convertToSymbol = '៛'
//     //     } else {
//     //         convertToSymbol = 'B'
//     //     }
//     //     Session.set("convertToSymbol", convertToSymbol);
//     //
//     //     if (baseCurrency && convertTo && baseAmount) {
//     //         Meteor.call("calculateExchangeRateSelling", baseCurrency, convertTo, baseAmount, function (error, result) {
//     //             if (!result) {
//     //                 clear();
//     //                 swal("Please check", "Your exchange rate are not yet data Entry!");
//     //             } else {
//     //                 state.set('toAmountBuying', result.buying);
//     //                 state.set('toAmount', result.selling);
//     //                 // instance.toAmount.set(result.selling);
//     //             }
//     //         });
//     //     }
//     // },
//     'change .convert-to'(e, instance){
//         //let baseAmount = instance.$('[name="baseAmount"]').val();
//         let baseCurrency = instance.$('[name="baseCurrency"]').val();
//         let convertTo = instance.$('[name="convertTo"]').val();
//         let convertToSymbol;
//         if (convertTo == 'USD') {
//             convertToSymbol = '$'
//         } else if (convertTo == 'KHR') {
//             convertToSymbol = '៛'
//         } else {
//             convertToSymbol = 'B'
//         }
//         Session.set("convertToSymbol", convertToSymbol);
//
//         if (baseCurrency && convertTo) {
//             Meteor.call("exchangeItemsLabel", baseCurrency, convertTo, function (err, res) {
//                 state.set('buyingRate', res.exBuyingRate);
//                 state.set('sellingRate', res.exSellingRate);
//                 // Session.set("exchangeRateLabelOnHelper", res.exSellingRate);
//             });
//         }
//
//     },
//     'keyup .base-amount'(e, instance){
//         let baseAmount = $(e.currentTarget).val();
//         let baseCurrency = instance.$('[name="baseCurrency"]').val();
//         let convertTo = instance.$('[name="convertTo"]').val();
//         if (baseCurrency && convertTo && baseAmount) {
//             Meteor.call("calculateExchangeRateSelling", baseCurrency, convertTo, baseAmount, function (error, result) {
//                 if (!result) {
//                     clear();
//                     swal("Please check", "Your exchange rate are not yet data Entry!");
//                 } else {
//                     state.set('toAmountBuying', result.buying);
//                     state.set('toAmount', result.selling);
//                 }
//             });
//         }
//     },
// });

let hooksObject = {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();

        // Check old item
        if (insertDoc.baseCurrency == currentDoc.baseCurrency && insertDoc.convertTo == currentDoc.convertTo) {
            itemsCollection.update(
                {baseCurrency: currentDoc.baseCurrency, convertTo: currentDoc.convertTo},
                updateDoc
            );
        } else {
            itemsCollection.remove({baseCurrency: currentDoc.baseCurrency, convertTo: currentDoc.convertTo});
            // Check exist item
            let exist = itemsCollection.findOne({baseCurrency: insertDoc.baseCurrency, convertTo: insertDoc.convertTo});
            if (exist) {
                let newBaseCurrency = exist.baseCurrency;
                let newBuying = exist.buying;
                let newSelling = exist.selling;
                let newBaseAmount = new BigNumber(exist.baseAmount).add(new BigNumber(insertDoc.baseAmount)).toFixed(2);
                let newToAmountBuying = new BigNumber(exist.toAmountBuying).add(new BigNumber(insertDoc.toAmountBuying)).toFixed(2);
                let newToAmount = new BigNumber(exist.toAmount).add(new BigNumber(insertDoc.toAmount)).toFixed(2);
                let newIncome = new BigNumber(exist.income).add(new BigNumber(insertDoc.income)).toFixed(2);
                itemsCollection.update(
                    {baseCurrency: insertDoc.baseCurrency, convertTo: insertDoc.converTo},
                    {
                        $set: {
                            baseCurrency: newBaseCurrency,
                            buying: newBuying,
                            selling: newSelling,
                            baseAmount: newBaseAmount,
                            toAmountBuying: newToAmountBuying,
                            toAmount: newToAmount,
                            income: newIncome
                        }
                    }
                );
            } else {
                itemsCollection.insert({
                    baseCurrency: insertDoc.baseCurrency,
                    buying: insertDoc.buying,
                    selling: insertDoc.selling,
                    convertTo: insertDoc.convertTo,
                    baseAmount: insertDoc.baseAmount,
                    toAmountBuying: insertDoc.toAmountBuying,
                    toAmount: insertDoc.toAmount,
                    income: insertDoc.income
                });
            }
        }

        this.done();
    },
    onSuccess: function (formType, result) {
        alertify.item().close();
        displaySuccess();
    },
    onError: function (formType, error) {
        displayError(error.message);
    }
};
AutoForm.addHooks(['MoneyTransfer_transactionItemsEdit'], hooksObject);
function clearFrom() {
    $('[name="baseCurrency"]').val('');
    $('[name="convertTo"]').val('');
    $('[name="baseAmount"]').val('');
    $('[name="toAmountBuying"]').val('');
    $('[name="toAmount"]').val('');
}
function clear() {
    $('[name="convertTo"]').val('');
    $('[name="baseAmount"]').val('');
    $('[name="toAmount"]').val('');
}
