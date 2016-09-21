import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const Provider = new Mongo.Collection("currencyExchange_provider");

Provider.generalSchema = new SimpleSchema({
    name: {
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
    status: {
        type: String,
        label: "Status",
        index: true,
        defaultValue: "E",
        autoform: {
            type: "select-radio-inline",
            options: function () {
                return [
                    {label: 'Enabled', value: 'E'},
                    {label: 'Disabled', value: 'D'},
                ];
            }
        },
    },
    telephone: {
        type: String
    },

    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    address: {
        type: String,
        optional:true
    }
});

Provider.attachSchema(Provider.generalSchema);
