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
export const Transfer = new Mongo.Collection('moneyTransfer_transfer');

Transfer.generalSchema = new SimpleSchema({
    transferType: {
        type: String,
        defaultValue: "thai",
        autoform: {
            type: 'select-radio-inline',
            options: function () {
                return [
                    {label: 'Thailand', value: 'thai'},
                    {label: 'Khmer', value: 'khmer'}
                ]
            }
        }
    },
    type: {
        type: String,
        autoform: {
            type: 'select-radio-inline',
            options: function () {
                if (Meteor.isClient) {
                    if (Session.get("type")) {
                        return [
                            {label: 'CD', value: 'CD'},
                            {label: 'CW', value: 'CW'},
                        ];
                    } else {
                        return [
                            {label: 'IN', value: 'IN'},
                            {label: 'OUT', value: 'OUT'}
                        ];

                    }
                }
            }
        }
    },
    dateNote: {
        type: Date,
        label: "Date Note",
        optional: true,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: 'bootstrap-datetimepicker',
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        }
    },
    timeNote: {
        type: String,
        label:"Time Note",
        optional: true,
        autoform: {
            afFieldInput: {
                type: "time"
            }
        }
    },
    transferDate: {
        type: Date,
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: 'bootstrap-datetimepicker',
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY HH:mm:ss',
                    showTodayButton: true
                }
            }
        }
    },
    senderId: {
        type: String,
        label: 'Sender',
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptsMethod.customer',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }
            }
        },
        custom: function () {
            let transferType = this.field('transferType');
            if (transferType.value == 'khmer') {
                if (!this.value) {
                    return 'required';
                }
            }
        }
    },
    senderTelephone: {
        type: String,
        label: 'Sender telephone',
        optional: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.phone();
            }
        },
        custom: function () {
            let transferType = this.field('transferType');
            if (transferType.value == 'khmer') {
                if (!this.value) {
                    return 'required';
                }
            }
        }
    },
    receiverId: {
        type: String,
        label: 'Receiver',
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptsMethod.customer',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let currentBranch = Session.get('currentBranch');
                        return {branchId: currentBranch};
                    }
                }
            }
        },
        custom: function () {
            let transferType = this.field('transferType');
            if (transferType.value == 'khmer') {
                if (!this.value) {
                    return 'required';
                }
            }
        }
    },
    receiverTelephone: {
        type: String,
        label: 'Receiver telephone',
        optional: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.phone();
            }
        },
        custom: function () {
            let transferType = this.field('transferType');
            if (transferType.value == 'khmer') {
                if (!this.value) {
                    return 'required';
                }
            }
        }
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true
    },

    branchId: {
        type: String,
        optional: true,
    }
});

Transfer.accountSchema = new SimpleSchema({
    productId: {
        type: String,
        label: 'Product',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.product'
            },
            optionsMethodParams: function () {
                if (Meteor.isClient) {
                    let type = AutoForm.getFieldValue('transferType') || 'thai';
                    return {type};
                }
            }
        }
    },
    currencyId: {
        type: String,
        label: 'Currency',
        autoform: {
            type: 'universe-select',
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    accountId: {
        type: String,
        label: "Account Id",
        optional: true
    },
    promotionId: {
        type: String,
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.promotion'
            }
        }
    },
    promotionAmount: {
        type: Number,
        decimal: true,
        optional: true
    },
    amount: {
        type: Number,
        decimal: true,
        label: 'Amount',
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    balanceAmount: {
        type: Number,
        decimal: true,
        optional: true,
    },
    agentFee: {
        type: Number,
        decimal: true,
        optional: true
    },
    balanceAgentFee: {
        type: Number,
        decimal: true,
        optional: true
    },
    customerFee: {
        type: Number,
        label: 'Customer fee',
        decimal: true,
        optional: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    deductFee: {
        type: Boolean,
        optional: true
    },
    discountFee: {
        type: Number,
        label: 'Discount fee',
        decimal: true,
        optional: true,
        min: 0,
        max: 100
    },
    totalFee: {
        type: Number,
        label: 'Total fee',
        decimal: true,
        optional: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    totalAmount: {
        type: Number,
        label: 'Total amount',
        decimal: true,
        optional: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let symbol = currencySymbol.get();
                return inputmaskOptions.currency({prefix: `${symbol} `});
            }
        }
    },
    refCode: {
        type: String,
        optional: true,
        label: 'Ref code'
    },
    feeDoc: {
        type: Object,
        optional: true,
        blackbox: true
    },
    lastBalance: {
        type: Object,
        optional: true,
        blackbox: true
    },
    'items': {
        type: [Object],
        optional: true,
    },
    'items.$._id': {
        type: String,
        optional: true
    },
    'items.$.baseCurrency': {
        type: String,
        optional: true
    },
    'items.$.selling': {
        type: String,
        optional: true
    },
    'items.$.convertTo': {
        type: String,
        optional: true
    },
    'items.$.baseAmount': {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    },
    'items.$.toAmount': {
        type: Number,
        decimal: true,
        optional: true,
        defaultValue: 0
    }
});

Transfer.attachSchema([
    Transfer.generalSchema,
    Transfer.accountSchema,
]);

