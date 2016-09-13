import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const Customer = new Mongo.Collection("moneyTransfer_customer");

Customer.generalSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        max: 250
    },
    gender: {
        type: String,
        label: 'Gender',
        defaultValue: "M",
        autoform: {
            type: "select-radio-inline",
            // options: function () {
            //     return SelectOpts.gender(false);
            // }
            options: function () {
                return [
                    {label: 'Male', value: 'M'},
                    {label: 'Female', value: 'F'}
                ];
            }
        }
    },
    notificationDay: {
        type: Number,
        label: "Notification Day",
    },
    dob: {
        type: Date,
        label: 'Date of birth',
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
    address: {
        type: String,
        label: 'Address',
        optional: true,
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
    expiredDate: {
        type: Date,
        optional: true
    },
    lastInvoice: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        label: 'Email',
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    },
    branchId: {
        type: String
    }
});

Customer.attachSchema(Customer.generalSchema);
