import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const FromThai = new Mongo.Collection("mt_transferFromThai");

FromThai.schema = new SimpleSchema({
    customerId: {
        type: String
    },
    thaiBankId: {
        type: String
    },
    code: {
        type: String
    },
    thaiServiceId: {
        type: String
    },
    time: {
        type: String
    },
    transferDate: {
        type: Date
    },
    amount: {
        type: Number,
        decimal: true
    },
    serviceAmount: {
        type: Number,
        decimal: true
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    FromThai.schema.i18n("moneyTransfer.fromThai.schema");
    FromThai.attachSchema(FromThai.schema);
});
