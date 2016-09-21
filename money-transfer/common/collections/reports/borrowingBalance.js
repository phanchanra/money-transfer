import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';
import {SelectOptsMethod} from '../../methods/select-opts-method.js';

export const BorrowingBalanceSchema = new SimpleSchema({
    branchId: {
        type: [String],
        label: 'Branch',
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.branch(false);
            }
        }
    },
    currencyId: {
        type: [String],
        label: 'Currency',
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    rptDate: {
        type: Date,
        label: 'Date',
        defaultValue: moment().toDate(),
        autoform: {
            type: 'bootstrap-datetimepicker',
            dateTimePickerOptions: {
                format: 'DD/MM/YYYY',
                showTodayButton: true
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
                optionsMethod: 'simplePos.selectOptsMethod.exchange'
            }
        }
    }
});
