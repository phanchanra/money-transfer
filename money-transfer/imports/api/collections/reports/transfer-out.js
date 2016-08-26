import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {dateRangePickerOpts} from '../../../../../core/client/libs/date-range-picker-opts';
import {SelectOpts} from '../../../ui/libs/select-opts.js';

export const TransferOutSchema = new SimpleSchema({
    dateFrom: {
        type: Date,
        label: 'Date From',
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
        ,
        custom: function () {//Another usage of the custom function.
            if (this.value > this.field('dateTo').value) {
                return "checkDateFrom";
            }
        }
    },
    dateTo: {
        type: Date,
        label: 'Date To',
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        },
        custom: function () {//Another usage of the custom function.
            if (this.value > this.field('dateFrom').value) {
                return "checkDate";
            }
        }
    },
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
    branch: {
        type: [String],
        label: 'Branch',
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.branch(false);
                // return [
                //     {label: 'BTB', value: '001'},
                //     {label: 'BMC', value: '002'},
                // ];
            },
            afFieldInput: {
                select2Options: {
                    multiple: true
                }
            }
        }
    }


});
SimpleSchema.messages({
    checkDateFrom: 'Date from must be less than date to!',
    checkDate: 'Date to must be greater than date from!'
});