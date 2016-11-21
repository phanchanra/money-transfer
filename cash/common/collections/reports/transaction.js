import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Method
import {SelectOptsMethod} from '../../../common/methods/select-opts-method';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';

export const TransactionSchema = new SimpleSchema({
    branchId: {
        type: [String],
        label: 'Branch',
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.branch();
            }
        }
    },
    cashType: {
        type: [String],
        label: "Cash type",
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.cashType(false, true);
            }
        }
    },
    currencyId: {
        type: [String],
        label: "Currency",
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    repDate: {
        type: [Date],
        label: 'Date',
        autoform: {
            type: "bootstrap-daterangepicker",
            afFieldInput: {
                dateRangePickerOptions: function () {
                    return dateRangePickerOptions;
                }
            }
        }
    },
    exchangeId: {
        type: String,
        label: 'Exchange',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'cash.selectOptsMethod.exchange'
            }
        }
    }
});
