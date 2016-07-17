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
    telephone: {
        type: String,
        optional:true
    },
    address: {
        type: String,
        optional:true
    },
    email:{
        type: String,
        optional:true
    },
    website: {
        type: String,
        optional: true
    }
});

Meteor.startup(function () {
    ThaiBank.schema.i18n("moneyTransfer.thaiBank.schema");
    ThaiBank.attachSchema(ThaiBank.schema);
});
