import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const FromKhmer = new Mongo.Collection("mt_transferFromKhmer");

FromKhmer.schema = new SimpleSchema({
    code: {
        type: String
    },
    name: {
        type: String
    },
    des: {
        type: String
    },
    branchId: {
        type: String
    }
});

Meteor.startup(function () {
    FromKhmer.schema.i18n("moneyTransfer.fromKhmer.schema");
    FromKhmer.attachSchema(FromKhmer.schema);
});
