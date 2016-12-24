import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';

export const ExchangeOutstandingSchema = new SimpleSchema({
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
    },
    repDate: {
        type: Date,
        label:"Date As",
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
