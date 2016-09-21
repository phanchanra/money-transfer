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
//     });
//}
export const ExchangeTransaction = new Mongo.Collection("currencyExchange_ExchangeTransaction");

ExchangeTransaction.generalSchema = new SimpleSchema({
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
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        }
    },
    customerId: {
        type: String,
        label:"Customer",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptsMethod.customer',

            }
        }
    },
    branchId: {
        type: String,
        optional: true,
    }
});

ExchangeTransaction.transactionSchema = new SimpleSchema({
    transaction: {
        type: [Object],
        label: 'Transaction',
        maxCount:2
    },
    'transaction.$.amount': {
        type: Number,
        label: 'Amount',
        decimal: true,
        min: 0.01,
    },
    'transaction.$.baseCurrency': {
        type: String,
        label: 'Base Currency',
        autoform: {
            type: 'select',
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    'transaction.$.convertTo': {
        type: String,
        label: 'Convert To',
        autoform: {
            type: 'select',
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    'transaction.$.convertAmount': {
        type: Number,
        label: 'Convert Amount',
        decimal: true,
        min: 0.01,
    }
});

ExchangeTransaction.attachSchema([
    ExchangeTransaction.generalSchema,
    ExchangeTransaction.transactionSchema
]);


