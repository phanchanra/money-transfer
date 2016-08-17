import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Supplier = new Mongo.Collection("mt_supplier");

Supplier.schema = new SimpleSchema({
    name: {
        type: String
    },
    status: {
        type: String,
        optional: true,
        defaultValue: "Internal",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return [
                    {label: "Internal", value: "Internal"},
                    {label: "External", value: "External"}
                ];
            }
        }
    },
    telephone: {
        type: String
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
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    address: {
        type: String,
        optional:true
    },
    branchId: {
        type: String,
    },
    //custom array object
    service: {
        type: [Object],
        minCount: 1
    },
    'service.$.fromAmount': {
        type: Number,
        decimal:true
    },
    'service.$.toAmount': {
        type: Number,
        decimal:true
    },
    'service.$.fee': {
        type: Number,
        decimal:true
    },
    'service.$.expend': {
        type: Number,
        optional: true,
        decimal:true
    },
    'service.$.income': {
        type: Number,
        optional: true,
        decimal:true
    },

});

Meteor.startup(function () {
    Supplier.schema.i18n("moneyTransfer.supplier.schema");
    Supplier.attachSchema(Supplier.schema);
});
