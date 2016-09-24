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
// Items sub schema
ExchangeTransaction.itemsSchema = new SimpleSchema({
    itemId: {
        type: String,
        label: 'Item'
    },
    baseCurrency: {
        type: String,
        label: 'Base Currency'
    },
    convertTo: {
        type: String,
        label: 'Convert To',
    },
    baseAmount: {
        type: Number,
        label: 'Base Amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency();
            }
        }
    },
    toAmount: {
        type: Number,
        label: 'To Amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency();
            }
        }
    }
});
ExchangeTransaction.schema = new SimpleSchema({
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
    items: {
        type: [ExchangeTransaction.itemsSchema],
    },
    branchId: {
        type: String,
        optional: true,
    }
});

ExchangeTransaction.attachSchema(ExchangeTransaction.schema);

