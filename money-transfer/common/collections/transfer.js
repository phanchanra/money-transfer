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
import {Product} from '../../common/collections/product';
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
            },
            defaultValue: function () {
                if (Meteor.isClient) {
                    if (Session.get("type")) {
                        return 'CD';
                    } else {
                        return 'IN';
                    }
                }
            }
        }
    },
    dateNote: {
        type: Date,
        label: "Date Note",
        optional: true,
        // defaultValue: moment().toDate(),
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
        label: "Time Note",
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
        // defaultValue:'0',
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
        // custom: function () {
        //     //let transferType = this.field('transferType');
        //     if (!this.field('transferType').value == 'thai' && !this.value) {
        //         //if (!this.value) {
        //         //return 'required';
        //         return "required";
        //         //}
        //     }
        // }
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
        // custom: function () {
        //     let transferType = this.field('transferType');
        //     if (transferType.value == 'thai') {
        //         if (!this.value) {
        //             return 'requiredSenderPhone';
        //         }
        //     }
        // }
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
    },
    bankName: {
        type: String,
        label: 'Bank Name',
        optional: true
    },
    bankNumber: {
        type: String,
        label: 'Bank Number',
        optional: true
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
            type: 'select2',
            options: function () {
                if (Meteor.isClient) {
                    Meteor.subscribe('moneyTransfer.product');
                    let list = [];
                    let transferType = AutoForm.getFieldValue('transferType') || 'thai';
                    list.push({label: "Select One", value: ''});
                    Product.find({type: transferType})
                        .forEach(function (obj) {
                            list.push({label: obj._id + "-" + obj.name, value: obj._id});
                        });
                    return list;
                }
            },
            // afFieldInput: {
            //     uniPlaceholder: 'Please search... (limit 10)',
            //     optionsMethod: 'moneyTransfer.selectOptsMethod.product'
            // },
            // optionsMethodParams: function () {
            //     if (Meteor.isClient) {
            //         let type = AutoForm.getFieldValue('transferType') || 'thai';
            //         return {type};
            //     }
            // }
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
            type: 'select2',
            // options: function () {
            //     return SelectOpts.promotion();
            //     //let currentDate = currentDate.get();
            //     if (Meteor.isClient) {
            //         let currentDate = Session.get('transferDate');
            //         let list = [];
            //         list.push({label: "Select One", value: ' '});
            //         Promotion.find({
            //             startDate: {$lt: moment(currentDate, "DD/MM/YYYY").add(1, 'days').toDate()},
            //             expiredDate: {$gte: moment(currentDate, "DD/MM/YYYY").toDate()}
            //         })
            //             .forEach(function (obj) {
            //                 list.push({label: obj._id + "-" + obj.name + "-" + obj.type, value: obj._id});
            //             });
            //         return list;
            //     }
            //}
            // afFieldInput: {
            //     uniPlaceholder: 'Please search... (limit 10)',
            //     optionsMethod: 'moneyTransfer.selectOptsMethod.promotion'
            // }
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
    // deductFee: {
    //     type: Boolean,
    //     optional: true
    // },
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
    //
    exchangeId: {
        type: String,
        optional: true
    },
    sellingFirst: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    baseAmountFirst: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    convertToFirst: {
        type: String,
        optional: true
    },
    toAmountFirst: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    //
    sellingSecond: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    baseAmountSecond: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    convertToSecond: {
        type: String,
        optional: true
    },
    toAmountSecond: {
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    buyingFirst:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    buyingSecond:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    toAmountBuyingFirst:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    toAmountBuyingSecond:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    incomeFirst:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    },
    incomeSecond:{
        type: Number,
        decimal: true,
        defaultValue: 0,
        optional: true
    }
    // //
    // 'items': {
    //     type: Object,
    //     optional: true,
    // },
    // 'items._id': {
    //     type: String,
    //     optional: true
    // },
    // 'items.baseCurrency': {
    //     type: String,
    //     optional: true
    // },
    // 'items.selling': {
    //     type: Number,
    //     decimal:true,
    //     defaultValue:0,
    //     optional: true
    // },
    // 'items.convertTo': {
    //     type: String,
    //     optional: true
    // },
    // 'items.baseAmount': {
    //     type: Number,
    //     decimal: true,
    //     defaultValue: 0,
    //     optional: true
    // },
    // 'items.toAmount': {
    //     type: Number,
    //     decimal: true,
    //     defaultValue: 0,
    //     optional: true,
    // }
});

Transfer.attachSchema([
    Transfer.generalSchema,
    Transfer.accountSchema,
]);

// SimpleSchema.messages({
//     // 'regEx firstName': "[label] can have alphabets only",
//     // 'regEx lastName': "[label] can have alphabets only",
//     required: 'Sender is required',
//     requiredSenderPhone:"Sender Phone"
//     // duplicateEmail: 'Email already in use',
//     // notUnique: 'Please use another email, this is already in use',
//     // 'regEx tel': 'Invalid phone number',
//     // 'regEx password': "Password must be 8-20 characters long and contain a lowercase alphabet, an uppercase alphabet, a digit and a special character",
// });