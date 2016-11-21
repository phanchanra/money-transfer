import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const Transaction = new Mongo.Collection("cash_transaction");

// Cash type
Transaction.cashTypeSchema = new SimpleSchema({
    cashType: {
        type: String,
        label: "Cash type",
        autoform: {
            type: "select",
            options: function () {
                return SelectOpts.cashType(false, true);
            }
        }
    },
});

let items = new SimpleSchema({
    chartCashId: {
        type: String,
        label: "Chart cash"
    },
    amount: {
        type: Number,
        label: 'Amount',
        decimal: true,
        min: 0.01,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    }
});

Transaction.schema = new SimpleSchema({
    transactionDate: {
        type: Date,
        label: "Transaction Date",
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
    cashType: {
        type: String,
        label: "Cash type",
        autoform: {
            type: "select",
            options: function () {
                return SelectOpts.cashType(false, true);
            }
        }
    },
    currencyId: {
        type: String,
        label: "Currency",
        defaultValue: 'KHR',
        autoform: {
            type: "select",
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    voucherId: {
        type: String,
        label: "Voucher",
        optional: true
    },
    des: {
        type: String,
        label: 'Description',
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor', // optional
                settings: {
                    height: 150,                 // set editor height
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
        type: Array,
        label: 'Items',
        minCount: 1
    },
    'items.$': {
        type: items
    },
    totalAmount: {
        type: Number,
        label: 'Total',
        decimal: true,
        min: 0.01,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    },
    refFrom: {
        type: String,
        optional: true
    },
    refId: {
        type: String,
        optional: true
    },
    branchId: {
        type: String
    }
});

Transaction.attachSchema(Transaction.schema);
