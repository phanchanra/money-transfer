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
        autoform: {
            type: 'universe-select',
            options: function () {
                 return SelectOpts.currency();
                // if (Meteor.isClient && this.isSet) {
                //
                //     Meteor.call("getCurrency", this.field('productId').value, function (error, result) {
                //         if (result) {
                //             return result;
                //         }
                //     });
                // }
            }
        }
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
    customerFee: {
        type: Number,
        label: 'Customer fee',
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
    discountFee: {
        type: Number,
        label: 'Discount fee',
        decimal: true,
        min: 0,
        max:100
    },
    totalFee: {
        type: Number,
        label: 'Total fee',
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
    totalAmount: {
        type: Number,
        label: 'Total amount',
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
    refCode: {
        type: String,
        label: 'Ref code'
    },
    feeDoc: {
        type: Object,
        optional: true,
        blackbox: true
    },
    //last balance
    lastOpeningAmountFee : {
        type: Number,
        decimal:true,
        optional: true
    },
    lastOpeningAmount: {
        type: Number,
        decimal:true,
        optional: true
    },
    lastCustomerFee: {
        type: Number,
        decimal:true,
        optional: true
    },
    lastOwnerFee:{
        type: Number,
        optional: true,
        decimal:true
    },
    lastAgentFee: {
        type: Number,
        optional: true,
        decimal:true
    },
    //tmp
    tmpOpeningAmount: {
        type: Number,
        decimal:true,
        optional:true
    },
    tmpCustomerFee: {
        type: Number,
        decimal: true,
        optional:true
    },
    tmpOwnerFee: {
        type: Number,
        decimal:true,
        optional:true
    },
    tmpAgentFee: {
        type: Number,
        decimal: true,
        optional:true
    },
    tmpOpeningAmountFee: {
        type: Number,
        decimal:true,
        optional:true
    }
});

Transfer.attachSchema([
    Transfer.generalSchema,
    Transfer.accountSchema,
]);
