import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const ThaiService = new Mongo.Collection("mt_thaiService");

ThaiService.schema = new SimpleSchema({
    fromAmount: {
        type: Number
    },
    toAmount: {
        type: Number
    },
    fee: {
        type: Number
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    ThaiService.schema.i18n("moneyTransfer.thaiService.schema");
    ThaiService.attachSchema(ThaiService.schema);
});
