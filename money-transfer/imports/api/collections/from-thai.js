import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const FromThai = new Mongo.Collection("mt_transferFromThai");

FromThai.schema = new SimpleSchema({
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
    thaiBankId: {
        type: String,
        label: "Bank",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptMethods.thaiBank'
            }
        }
    },
    code: {
        type: String,
        label: "Code"
    },

    thaiServiceId: {
        type: String,
        label: "Service"
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
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    FromThai.schema.i18n("moneyTransfer.fromThai.schema");
    FromThai.attachSchema(FromThai.schema);
});
