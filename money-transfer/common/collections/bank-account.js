// import {Mongo} from 'meteor/mongo';
// import {SimpleSchema} from 'meteor/aldeed:simple-schema';
// import {AutoForm} from 'meteor/aldeed:autoform';
// import {moment} from 'meteor/momentjs:moment';
//
// // Lib
// import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
// import {SelectOpts} from '../../imports/libs/select-opts.js';
// let currencySymbol = new ReactiveVar();
// if (Meteor.isClient) {
//     Tracker.autorun(function () {
//         if (Session.get('currencySymbol')) {
//             currencySymbol.set(Session.get('currencySymbol'));
//         }
//     });
// }
// export const BankAccount = new Mongo.Collection('moneyTransfer_transfer');
//
// BankAccount.generalSchema = new SimpleSchema({
//     type: {
//         type: String,
//         autoform: {
//             type: 'select-radio-inline',
//             options: function () {
//                 return [
//                     {label: 'CD', value: 'CD'},
//                     {label: 'CW', value: 'CW'},
//                 ];
//
//             }
//         }
//     },
//     transferDate: {
//         type: Date,
//         defaultValue: moment().toDate(),
//         autoform: {
//             afFieldInput: {
//                 type: 'bootstrap-datetimepicker',
//                 dateTimePickerOptions: {
//                     format: 'DD/MM/YYYY HH:mm:ss',
//                     showTodayButton: true
//                 }
//             }
//         }
//     },
//     productId: {
//         type: String,
//         label: 'Product',
//         autoform: {
//             type: 'universe-select',
//             afFieldInput: {
//                 uniPlaceholder: 'Please search... (limit 10)',
//                 optionsMethod: 'moneyTransfer.selectOptMethods.product'
//             }
//         }
//     },
//     currencyId: {
//         type: String,
//         label: 'Currency',
//         autoform: {
//             type: 'universe-select',
//             options: function () {
//                 return SelectOpts.currency();
//                 // if (Meteor.isClient && this.isSet) {
//                 //
//                 //     Meteor.call("getCurrency", this.field('productId').value, function (error, result) {
//                 //         if (result) {
//                 //             return result;
//                 //         }
//                 //     });
//                 // }
//             }
//         }
//     },
//     accountId: {
//         type: String,
//         label: "Account Id",
//         optional: true
//     },
//     amount: {
//         type: Number,
//         decimal: true,
//         label: 'Amount',
//         autoform: {
//             type: 'inputmask',
//             inputmaskOptions: function () {
//                 let symbol = currencySymbol.get();
//                 return inputmaskOptions.currency({prefix: `${symbol} `});
//             }
//         }
//     },
//     balanceAmount: {
//         type: Number,
//         decimal: true,
//         optional: true,
//     },
// });
//
//
// BankAccount.attachSchema([
//     BankAccount.generalSchema,
// ]);
