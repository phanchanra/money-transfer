import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOptsMethod} from '../../common/methods/select-opts-method';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const BorrowingPay = new Mongo.Collection('moneyTransfer_borrowingPay');

BorrowingPay.generalSchema = new SimpleSchema({
    customerId: {
        type: String,
        label: 'Customer',
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
        }
    },
    borrowingId: {
        type: String,
        label: 'Borrowing ID',
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                optionsMethod: 'moneyTransfer.selectOptsMethod.borrowing',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        let customerId = AutoForm.getFieldValue('customerId');
                        return {customerId: customerId};
                    }
                }
            }
        }
    },
    paidDate: {
        type: Date,
        label: "BorrowingPay date",
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
    'dueDoc.principal': {
        type: Number,
        label: 'Principal due',
        decimal: true,
        min: 1,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    'dueDoc.interest': {
        type: Number,
        label: 'Interest due',
        decimal: true,
        min: 1,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
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
        label: 'Paid doc'
    },
    'paidDoc.principal': {
        type: Number,
        label: 'Pricipal paid',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    'paidDoc.interest': {
        type: Number,
        label: 'Interest paid',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    balanceDoc: {
        type: Object,
        label: 'Balance doc'
    },
    'balanceDoc.principal': {
        type: Number,
        label: 'Principal balance',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    'balanceDoc.interest': {
        type: Number,
        label: 'Interest balance',
        decimal: true,
        min: 0,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let currencyId = AutoForm.getFieldValue('currencyId');
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true,
        autoform: {
            type: 'textarea'
        }
    },
    branchId: {
        type: String
    }
});

BorrowingPay.attachSchema([BorrowingPay.generalSchema]);
