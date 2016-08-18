import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Transfer = new Mongo.Collection('moneyTransfer_transfer');

Transfer.generalSchema = new SimpleSchema({
    transferType: {
        type: String,
        optional: true,
        defaultValue: 'In',
        autoform: {
            type: 'select-radio-inline',
            options: function () {
                return [
                    {label: 'In', value: 'In'},
                    {label: 'Out', value: 'Out'}
                ];
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
    senderTelephone: {
        type: String,
        label: 'Sender telephone',
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.phone();
            }
        }
    },
    receiverId: {
        type: String,
        label: 'Receiver',
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
    receiverTelephone: {
        type: String,
        label: 'Receiver telephone',
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.phone();
            }
        }
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true
    },
    branchId: {
        type: String
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
                optionsMethod: 'moneyTransfer.selectOptMethods.product'
            }
        }
    },
    currencyId: {
        type: String,
        label: 'Currency',
        defaultValue: 'USD',
        autoform: {
            type: 'select-radio-inline',
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    amount: {
        type: Number,
        decimal: true,
        label: 'Amount'
    },
    customerFee: {
        type: Number,
        label: 'Customer fee',
        decimal: true,
        min: 0
    },
    discountFee: {
        type: Number,
        label: 'Discount fee',
        decimal: true,
        min: 0
    },
    totalFee: {
        type: Number,
        label: 'Total fee',
        decimal: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        label: 'Total amount',
        decimal: true,
        min: 0
    },
    refCode: {
        type: String,
        label: 'Ref code'
    },
    feeDoc: {
        type: Object,
        optional: true,
        blackbox: true
    }
});

Transfer.attachSchema([
    Transfer.generalSchema,
    Transfer.accountSchema,
]);
