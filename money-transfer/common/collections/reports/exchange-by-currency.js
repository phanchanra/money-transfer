import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';

export const ExchangeByCurrencySchema = new SimpleSchema({
    branch: {
        type: [String],
        label: 'Branch',
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.branch(false);
            },
            afFieldInput: {
                select2Options: {
                    multiple: true
                }
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
    exchange: {
        type: String,
        label: 'Exchange',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.exchange'
            }
        }
    }
});
