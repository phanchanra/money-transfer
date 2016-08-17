import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const MoneyTransfer = new Mongo.Collection("mt_transfer");

MoneyTransfer.schema = new SimpleSchema({
    invoice: {
        type: String,
        optional: true,
        label: "Invoice"
    },
    transferDate: {
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
    transferType: {
        type: String,
        optional: true,
        defaultValue: "In",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return [
                    {label: "Transfer In", value: "In"},
                    {label: "Transfer Out", value: "Out"}
                ];
            }
        }
    },
    feeType: {
        type: String,
        optional: true,
        defaultValue: "Default",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return [
                    {label: "Default Price", value: "Default"},
                    {label: "Custom Price", value: "Custom"}
                ];
            }
        }
    },
    senderId: {
        type: String,
        label: "Sender",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptMethods.customer',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }
            }
        }
    },
    receiverId: {
        type: String,
        label: "Receiver",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptMethods.customer',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }
            }
        }
    },
    supplierId: {
        type: String,
        label: "Supplier",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptMethods.supplier'
            }
        }
    },
    code: {
        type: String,
        label: "Account Code"
    },
    amount: {
        type: Number,
        decimal: true,
        label: "Amount"
    },
    amountFee: {
        type: Number,
        decimal: true,
        label: "Amount Fee"
    },
    expend:{
        type:Number,
        decimal:true,
        optional:true
    },
    income:{
       type:Number,
       decimal:true,
       optional:true
    },
    currency: {
        type: String,
        label: "Currency",
        defaultValue: "THB",
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    exchanges: {
        type: [Object],
        optional: true
    },
    'exchange.$': {
        type: Object,
        optional: true
    },
    'exchange.$.currency': {
        type: String,
        optional: true
    },
    'exchange.$.fromAmount': {
        type: Number,
        decimal: true,
        min:0,
        optional: true
    },
    'exchange.$.toAmount': {
        type: Number,
        decimal: true,
        optional: true
    },
    remainAmount: {
        type: Number,
        decimal: true,
        optional: true,
        label: "Remain Amount"
    },
    description: {
        type: String,
        optional: true,
        label: "Description"
    },
    status:{
        type: String
    },

    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    MoneyTransfer.schema.i18n("moneyTransfer.moneyTransfer.schema");
    MoneyTransfer.attachSchema(MoneyTransfer.schema);
});
