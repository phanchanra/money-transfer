import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Exchange = new Mongo.Collection("mt_exchange");

Exchange.schema = new SimpleSchema({
    date: {
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
    //==================
    'baseKhr': {
        type: Object
    },
    'baseKhr.KHR': {
        type: Number,
        defaultValue:1,
        label: "KHR",
        autoform: {
            afFieldInput: {
                readonly: true
            }
        }
    },
    'baseKhr.USD': {
        type: Number,
        decimal: true,
        label: "USD"
    },
    'baseKhr.THB': {
        type: Number,
        label: "THB"
    },

    //====================
    //===========
    'baseUsd':{
        type:Object
    },
    'baseUsd.USD': {
        type: Number,
        defaultValue:1,
        decimal:true,
        label:"USD",
        autoform: {
            afFieldInput: {
                readonly: true
            }
        }
    },
    'baseUsd.KHR': {
        type: Number,
        label:"KHR"
    },
    'baseUsd.THB': {
        type: Number,
        label:"THB"
    },
    // //============
    'baseThb':{
        type:Object
    },
    'baseThb.THB': {
        type: Number,
        defaultValue:1,
        label:"THB",
        autoform: {
            afFieldInput: {
                readonly: true
            }
        }
    },
    'baseThb.KHR': {
        type: Number,
        label:"KHR"
    },
    'baseThb.USD': {
        type: Number,
        decimal:true,
        label:"USD"
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    Exchange.schema.i18n("moneyTransfer.exchange.schema");
    Exchange.attachSchema(Exchange.schema);
});
