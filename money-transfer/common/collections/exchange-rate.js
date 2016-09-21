import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';
// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

let currencySymbol = new ReactiveVar();
if (Meteor.isClient) {
    Tracker.autorun(function () {
        if (Session.get('currencySymbol')) {
            currencySymbol.set(Session.get('currencySymbol'));
        }

    });
}
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
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        }
    },
    baseCurrency: {
        type: String,
        label: "Base Currency",
        index: true,
        defaultValue: "USD",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return SelectOpts.currency(true);
            }
        },
    },
});

ExchangeRate.convertSchema = new SimpleSchema({
    convert: {
        type: [Object],
        minCount: 1,
        maxCount: 2
    },
    'convert.$.amount': {
        type: Number,
        decimal: true,
        defaultValue: 0,
        min: 0.01,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get() == null ? '$' : currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    'convert.$.convertTo': {
        type: String,
        autoform: {
            type: 'select',
            options: function () {
                return SelectOpts.currencyExchange(true);
            }
        }
    },
    'convert.$.buying': {
        type: Number,
        decimal: true,
        defaultValue: 0,
        min: 0.01
    },
    'convert.$.selling': {
        type: Number,
        decimal: true
    },
    'convert.$.convertAmount': {
        type: Number,
        decimal: true
    }
});

ExchangeRate.attachSchema([
    ExchangeRate.generalSchema,
    ExchangeRate.convertSchema
]);


