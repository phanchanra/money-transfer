import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const ThaiBank = new Mongo.Collection("mt_thaiBank");

ThaiBank.schema = new SimpleSchema({
    name: {
        type: String
    },
    des: {
        type: String,
        optional: true
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    ThaiBank.schema.i18n("moneyTransfer.thaiBank.schema");
    ThaiBank.attachSchema(ThaiBank.schema);
});
