import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {dateRangePickerOpts} from '../../../../../core/client/libs/date-range-picker-opts';
import {SelectOpts} from '../../../ui/libs/select-opts.js';

export const TransferBalanceOutstandingSchema = new SimpleSchema({
    product: {
        type: [String],
        label: 'Product',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptMethods.product',
                multiple: true
            }
        }
    },
    repDate: {
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
    }
});
