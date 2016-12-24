import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';
// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

// let baseCurrencySymbol = new ReactiveVar();
// if (Meteor.isClient) {
//     Tracker.autorun(function () {
//         if (Session.get('baseCurrencySymbol')) {
//             baseCurrencySymbol.set(Session.get('baseCurrencySymbol'));
//         }
//     });
// }
export const ExchangeTransaction = new Mongo.Collection("currencyExchange_ExchangeTransaction");
// Items sub schema
ExchangeTransaction.itemsSchema = new SimpleSchema({
    baseCurrency: {
        type: String,
        label: 'Base Currency',
        optional:true
    },
    buying:{
        type: String,
        optional:true
    },
    selling:{
        type: String,
        optional:true
    },
    customSelling:{
        type: String,
        optional:true
    },
    convertTo: {
        type: String,
        label: 'Convert To',
    },
    baseAmount: {
        type: Number,
        label: 'Base Amount',
        decimal: true,
        optional:true
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         let baseSymbol = baseCurrencySymbol.get();
        //         console.log(baseSymbol);
        //         return inputmaskOptions.currency({prefix: `${baseSymbol} `});
        //     }
        // }
    },
    toAmountBuying: {
        type: Number,
        decimal: true,
        optional:true
    },
    toAmount: {
        type: Number,
        label: 'To Amount',
        decimal: true,
        optional:true
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         return inputmaskOptions.currency();
        //     }
        // }
    },
    income: {
        type: Number,
        decimal: true,
        optional:true
    },
    costs:{
        type:[Object],
        optional:true,
        blackbox:true
    },
});
//==========================================
// let exchangeFormSchema = new SimpleSchema({
//     buyingFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     sellingFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     baseAmountFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     convertToFirst: {
//         type: String,
//         optional: true
//     },
//     toAmountBuyingFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     toAmountFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     incomeFirst: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     //
//     buyingSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     sellingSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     baseAmountSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     convertToSecond: {
//         type: String,
//         optional: true
//     },
//     toAmountBuyingSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     toAmountSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     },
//     incomeSecond: {
//         type: Number,
//         decimal: true,
//         defaultValue: 0,
//         optional: true
//     }
// });
//==========================================
ExchangeTransaction.schema = new SimpleSchema({
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
        label: "Customer",
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptsMethod.customer',

            }
        }
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    height: 100,                 // set editor height
                    minHeight: null,             // set minimum height of editor
                    maxHeight: null,             // set maximum height of editor
                    toolbar: [
                        ['font', ['bold', 'italic', 'underline', 'clear']], //['font', ['bold', 'italic', 'underline', 'clear']],
                        ['para', ['ul', 'ol']] //['para', ['ul', 'ol', 'paragraph']],
                        //['insert', ['link', 'picture']], //['insert', ['link', 'picture', 'hr']],
                    ]
                } // summernote options goes here
            }
        }
    },
    items: {
        type: [ExchangeTransaction.itemsSchema],
    },
    transferId: {
        type: String,
        optional: true
    },
    // transactionExchangeRef: {
    //     type: String,
    //     optional: true
    // }
    branchId: {
        type: String,
        optional: true,
    },
});

ExchangeTransaction.attachSchema(ExchangeTransaction.schema);

