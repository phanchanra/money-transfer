import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';

export const DepositWithdrawalSchema = new SimpleSchema({
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
    type: {
        type: [String],
        label: 'Type',
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.depositWithdrawal(false);
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
    product: {
        type: [String],
        label: 'Product',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.product',
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
    },
    exchange:{
        type:String,
        label:'Exchange',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'moneyTransfer.selectOptsMethod.exchange'
            }
        }
    }
});
