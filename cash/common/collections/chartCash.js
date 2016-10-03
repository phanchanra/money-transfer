import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const ChartCash = new Mongo.Collection("cash_chart");

ChartCash.schema = new SimpleSchema({
    cashType: {
        type: String,
        label: 'Cash type',
        defaultValue: 'In',
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return SelectOpts.cashType();
            }
        }
    },
    name: {
        type: String,
        label: 'Name',
        unique: true,
        max: 250
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true,
        autoform: {
            afFieldInput: {
                rows: 3
            }
        }
    },
});

ChartCash.attachSchema(ChartCash.schema);
