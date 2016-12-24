import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const ExchangeStock = new Mongo.Collection("currencyExchange_stock");

ExchangeStock.generalSchema = new SimpleSchema({
    stockDate: {
        type: Date,
        optional:true
    },
    status: {
        type: String,
        optional:true
    },
    exchangeId: {
        type: String,
        optional: true
    },
    index:{
        type: Number,
        index:true,
        optional:true
    },
    baseCurrency: {
        type: String,
        optional: true,
        index:true
    },
    originalBaseAmount: {
        type: Number,
        decimal: true,
        optional: true
    },
    baseAmount: {
        type: Number,
        decimal: true,
        optional: true
    },
    baseAmountSelling: {
        type: Number,
        decimal: true,
        optional: true
    },
    convertTo: {
        type: String,
        optional: true,
        index:true
    },
    buying: {
        type: Number,
        decimal: true,
        optional: true
    },
    selling: {
        type: Number,
        decimal: true,
        optional: true
    },
    amount: {
        type: Number,
        decimal: true,
        optional: true
    },
    balanceAmount: {
        type: Number,
        decimal: true,
        optional: true,
        index:true
    },
    balanceVariety:{
        type: Number,
        decimal: true,
        optional: true,
    },
    balanceSelling:{
        type: Number,
        decimal: true,
        optional: true,
    },
    branchId: {
        type: String,
        optional: true
    }
});
ExchangeStock.attachSchema(ExchangeStock.generalSchema);
