import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../ui/libs/select-opts.js';

export const Product = new Mongo.Collection("moneyTransfer_product");

Product.generalSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        unique: true,
        max: 250
    },
    registerDate: {
        type: Date,
        label: 'Register date',
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: 'bootstrap-datetimepicker',
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        }
    },
    status: {
        type: String,
        label: 'Status',
        defaultValue: "E",
        optional: true,
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return [
                    {label: "Enable", value: "E"},
                    {label: "Disable", value: "D"}
                ];
            }
        }
    },
    memo: {
        type: String,
        label: 'Memo',
        optional: true,
        autoform: {
            afFieldInput: {
                rows: 3
            }
        }
    },
});

Product.contactSchema = new SimpleSchema({
    address: {
        type: String,
        label: 'Address',
        autoform: {
            afFieldInput: {
                rows: 3
            }
        }
    },
    telephone: {
        type: String,
        label: 'Telephone',
        optional: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.phone();
            }
        }
    },
    email: {
        type: String,
        label: 'Email',
        regEx: SimpleSchema.RegEx.Email,
        optional: true,
    },
    website: {
        type: String,
        label: 'Website',
        regEx: SimpleSchema.RegEx.Domain,
        optional: true,
    }
});

Product.attachSchema([Product.generalSchema, Product.contactSchema,]);
