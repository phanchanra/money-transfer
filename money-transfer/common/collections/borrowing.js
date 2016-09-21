import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOptsMethod} from '../../common/methods/select-opts-method';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const Borrowing = new Mongo.Collection('moneyTransfer_borrowing');

Borrowing.generalSchema = new SimpleSchema({
    customerId: {
        type: String,
        label: 'Customer',
        optional: true,
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Select One',
                uniDisabled: function () {
                    return Meteor.isClient && Session.get('disableCustomerId');
                },
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
    borrowingType: {
        type: String,
        label: "Borrowing type",
        allowedValues: ['GR', 'RS']
    },
    refId: {
        type: String,
        label: 'Ref ID',
        optional: true,
    },
    borrowingDate: {
        type: Date,
        label: "Borrowing date",
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
    borrowingDateText: {
        type: String,
        optional: true
    },
    term: {
        type: Number,
        label: 'Term (month)',
        min: 1,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.integer();
            }
        }
    },
    maturityDate: {
        type: Date,
        label: "Maturity date",
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
    tenor: { // Total of day number
        type: Number,
        label: 'Tenor (days)',
        min: 1,
        optional: true
    },
    currencyId: {
        type: String,
        label: 'Currency',
        defaultValue: 'KHR',
        autoform: {
            type: 'select',
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    interestRate: {
        type: Number,
        label: 'Interest rate',
        decimal: true,
        min: 0,
        max: 100,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.percentage();
            }
        }
    },
    borrowingAmount: {
        type: Number,
        label: 'Borrow amount',
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
    projectInterest: {
        type: Number,
        label: 'Project interest',
        decimal: true,
        min: 0,
        optional: true
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
    status: {
        type: String,
        allowedValues: ['Inactive', 'Active', 'Reschedule', 'Close']
    },
    activeDate: {
        type: Date,
        label: 'Active date',
        optional: true,
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
    rescheduleDate: {
        type: Date,
        optional: true
    },
    closeDate: {
        type: Date,
        optional: true
    },
    branchId: {
        type: String
    }
});

Borrowing.attachSchema([Borrowing.generalSchema]);
