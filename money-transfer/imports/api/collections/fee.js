import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';
// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';
let currencySymbol = new ReactiveVar();
if (Meteor.isClient) {
    Tracker.autorun(function () {
        if (Session.get('currencySymbol')) {
            currencySymbol.set(Session.get('currencySymbol'));
        }
    });
}
export const Fee = new Mongo.Collection("moneyTransfer_fee");

Fee.generalSchema = new SimpleSchema({
    productId: {
        type: String,
        label: 'Product',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptMethods.product'
            }
        }

    },
    currencyId: {
        type: String,
        label: "Currency",
        defaultValue: "USD",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return SelectOpts.currency(true);
            }
        },

    },
    accountId: {
        type: String,
        label: 'Account ID',
        optional: true,
    },
    openingAmount: {
        type: Number,
        label: 'Opening amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
});

Fee.serviceSchema = new SimpleSchema({
    service: {
        type: [Object],
        label: 'Service fee',
        minCount: 1
    },
    'service.$.fromAmount': {
        type: Number,
        label: 'From amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    'service.$.toAmount': {
        type: Number,
        label: 'To amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    'service.$.customerFee': {
        type: Number,
        label: 'Customer fee',
        decimal: true,
        min: 0.01,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    'service.$.ownerFee': {
        type: Number,
        label: 'Owner fee',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    'service.$.agentFee': {
        type: Number,
        label: 'Agent fee',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    }
});

Fee.attachSchema([
    Fee.generalSchema,
    Fee.serviceSchema,
]);
// SimpleSchema.messages({
//     duplicateId: 'Id already in use',
//     notUnique: 'Please use another Id, this is already in use',
// });

