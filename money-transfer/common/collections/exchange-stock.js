import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const ExchangeStock = new Mongo.Collection("currencyExchange_stock");

ExchangeStock.schema = new SimpleSchema({
    baseCurrency:{
        type: String,
        optional: true,
        index:true
    },
    convertTo: {
        type: String,
        optional: true,
        index:true
    },
    exchangeDate: {
        type: Date,
    },
    status: {
        type: String
    },
    amount: {
        type: Number,
        decimal: true,
        optional: true
    },
    balanceAmount: {
        type: Number,
        decimal: true,
        optional: true
    },
    exchangeId:{
        type:String,
        optional:true
    },
    branchId: {
        type: String,
        optional: true
    }
});

ExchangeStock.attachSchema(ExchangeStock.schema);
