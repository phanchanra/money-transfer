import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Sender = new Mongo.Collection("mt_sender");

Sender.schema = new SimpleSchema({
    name: {
        type: String
    },
    gender: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.gender();
            }
        }
    },
    telephone: {
        type: String
    },
  
    address: {
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
    Sender.schema.i18n("moneyTransfer.sender.schema");
    Sender.attachSchema(Sender.schema);
});
