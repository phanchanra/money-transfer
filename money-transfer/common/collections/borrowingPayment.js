import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOptsMethod} from '../../common/methods/select-opts-method';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const BorrowingPayment = new Mongo.Collection('moneyTransfer_borrowingPayment');

BorrowingPayment.generalSchema = new SimpleSchema({
    borrowingId: {
        type: String,
        label: 'Borrowing ID',
        // autoform: {
        //     type: 'universe-select',
        //     afFieldInput: {
        //         uniPlaceholder: 'Select One',
        //         optionsMethod: 'moneyTransfer.selectOptsMethod.borrowing',
        //         optionsMethodParams: function () {
        //             if (Meteor.isClient) {
        //                 let customerId = FlowRouter.getParam('customerId');
        //                 return {customerId: customerId};
        //             }
        //         }
        //     }
        // }
    },
    paidDate: {
        type: Date,
        label: "Paid date",
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
    dueDoc: {
        type: Object,
        label: 'Due doc'
    },
    'dueDoc.numOfDay': {
        type: Number,
        label: 'No. of day',
        min: 0,
    },
    'dueDoc.currentInterest': {
        type: Number,
        label: 'Current interest due',
        decimal: true,
        min: 0,
    },
    'dueDoc.totalAmount': {
        type: Number,
        decimal: true,
        min: 0.01,
    },
    paidAmount: {
        type: Number,
        label: 'Paid amount',
        decimal: true,
        min: 0.01,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    paidDoc: {
        type: Object,
        label: 'Paid doc',
        optional: true
    },
    'paidDoc.principal': {
        type: Number,
        label: 'Pricipal paid',
        decimal: true,
        min: 0,
    },
    'paidDoc.interest': {
        type: Number,
        label: 'Interest paid',
        decimal: true,
        min: 0,
    },
    balanceDoc: {
        type: Object,
        label: 'Balance doc',
        optional: true
    },
    'balanceDoc.principal': {
        type: Number,
        label: 'Principal balance',
        decimal: true,
        min: 0,
    },
    'balanceDoc.interest': {
        type: Number,
        label: 'Interest balance',
        decimal: true,
        min: 0,
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true,
        autoform: {
            type: 'textarea'
        }
    },
    status: {
        type: String,
        label: 'Status',
        optional: true,
    },
    lastPaymentDoc: {
        type: Object,
        optional: true,
        blackbox: true
    },
    branchId: {
        type: String
    }
});

BorrowingPayment.attachSchema([BorrowingPayment.generalSchema]);
