import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const CashIn = new Mongo.Collection("mt_cashIn");

CashIn.schema = new SimpleSchema({
    cashInDate: {
        type: Date,
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
    },
    'cash':{
        type:Object
    },
    'cash.KHR': {
        type: Number,
        label:"KHR"
    },
    'cash.USD': {
        type: Number,
        decimal:true,
        label:"USD"
    },
    'cash.THB': {
        type: Number,
        label:"THB"
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    CashIn.schema.i18n("moneyTransfer.cashIn.schema");
    CashIn.attachSchema(CashIn.schema);
});
