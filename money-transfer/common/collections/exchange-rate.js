import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';
// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

// let currencySymbol = new ReactiveVar();
// if (Meteor.isClient) {
//     Tracker.autorun(function () {
//         if (Session.get('currencySymbol')) {
//             currencySymbol.set(Session.get('currencySymbol'));
//         }
//
//     });
// }
export const ExchangeRate = new Mongo.Collection("currencyExchange_ExchangeRate");

ExchangeRate.generalSchema = new SimpleSchema({
    providerId: {
        type: String,
        label: 'Provider',
        index: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.provider'
            }
        }

    },
    exchangeDate: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY HH:mm:ss',
                    showTodayButton: true
                }
            }
        }
    },
    // baseCurrency: {
    //     type: String,
    //     label: "Base Currency",
    //     index: true,
    //     defaultValue: "USD",
    //     autoform: {
    //         type: "select-radio-inline",
    //         options: function () {
    //             return SelectOpts.currency(true);
    //         }
    //     },
    // },
    branchId: {
        type: String,
        optional: true
    }
});

ExchangeRate.convertCurrencySchema = new SimpleSchema({
    convertCurrency: {
        type: [Object],
        minCount: 1,
        maxCount: 6
    },
    'convertCurrency.$.baseCurrency': {
        type: String,
        label: "Base Currency",
        index: true,
        //defaultValue: "USD",
        autoform: {
            type: "select",
            options: function () {
                return SelectOpts.currency(true);
            }
        },
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         let symbol = currencySymbol.get() == null ? '$' : currencySymbol.get();
        //         return inputmaskOptions.currency({prefix: `${symbol} `});
        //     }
        // }
    },
    'convertCurrency.$.amount': {
        type: Number,
        decimal: true,
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         let symbol = currencySymbol.get() == null ? '$' : currencySymbol.get();
        //         return inputmaskOptions.currency({prefix: `${symbol} `});
        //     }
        // }
    },
    'convertCurrency.$.convertTo': {
        type: String,
        autoform: {
            type: 'select',
            options: function () {
                return SelectOpts.currencyExchange(true);
            }
        }
    },
    'convertCurrency.$.buying': {
        type: Number,
        decimal: true,
    },
    'convertCurrency.$.selling': {
        type: Number,
        decimal: true
    },
    'convertCurrency.$.convertAmount': {
        type: Number,
        decimal: true
    }
});

ExchangeRate.attachSchema([
    ExchangeRate.generalSchema,
    ExchangeRate.convertCurrencySchema
]);


