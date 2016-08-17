import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Service = new Mongo.Collection("mt_service");

Service.schema = new SimpleSchema({
    supplierId:{
        type:String,
        label:"Supplier"
    },
    registerDate: {
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

    fromAmount: {
        type: Number,
        decimal:true
    },
    toAmount: {
        type: Number,
        decimal:true
    },
    fee: {
        type: Number,
        decimal:true
    },
    supplierFee: {
        type: Number,
        optional: true,
        decimal:true
    },
    profit: {
        type: Number,
        optional: true,
        decimal:true
    },

});

Meteor.startup(function () {
    Service.schema.i18n("moneyTransfer.service.schema");
    Service.attachSchema(Service.schema);
});
