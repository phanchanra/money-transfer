import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {dateRangePickerOpts} from '../../../../../core/client/libs/date-range-picker-opts';
import {SelectOpts} from '../../../ui/libs/select-opts.js';

export const TransferDetailSchema = new SimpleSchema({

    repDate: {
        type: [Date],
        label: 'Date',
        autoform: {
            type: "bootstrap-daterangepicker",
            afFieldInput: {
                dateRangePickerOptions: dateRangePickerOpts
            }
        }
    },
    type: {
        type: [String],
        label: 'Type',
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.transfer(false);
            },
            afFieldInput: {
                select2Options: {
                    multiple: true
                }
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
            },
            afFieldInput: {
                select2Options: {
                    multiple: true
                }
            }
        }
    },
    exchange:{
        type:String,
        label:'Exchange',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptMethods.exchange'
            }
        }
    }

});
