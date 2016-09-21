import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';
import {SelectOptsMethod} from '../../methods/select-opts-method.js';

export const BorrowingStatusSchema = new SimpleSchema({
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
    // borrowingType: {
    //     type: [String],
    //     label: 'Borrowing type',
    //     autoform: {
    //         type: "select2",
    //         multiple: true,
    //         options: function () {
    //             return [
    //                 {label: 'GR', value: 'GR'},
    //                 {label: 'RS', value: 'RS'}
    //             ];
    //         }
    //     }
    // },
    status: {
        type: String,
        label: 'Status',
        autoform: {
            type: "select",
            options: function () {
                return [
                    // {label: 'Inactive', value: 'Inactive'},
                    {label: 'Active', value: 'Active'},
                    {label: 'Reschedule', value: 'Reschedule'},
                    {label: 'Close', value: 'Close'}
                ];
            }
        }
    },
    rptDate: {
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
                optionsMethod: 'simplePos.selectOptsMethod.exchange'
            }
        }
    }
});
