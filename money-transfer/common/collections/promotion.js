import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

export const Promotion = new Mongo.Collection("moneyTransfer_promotion");

Promotion.generalSchema = new SimpleSchema({
    name: {
        type: String,
        label: 'Name',
        max: 250
    },
    startDate:{
        type:Date,
        label:"Start Date",
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
    expiredDate: {
        type: Date,
        label:"Expired Date",
        defaultValue: moment().toDate(),
        autoform: {
            afFieldInput: {
                type: "bootstrap-datetimepicker",
                dateTimePickerOptions: {
                    format: 'DD/MM/YYYY',
                    showTodayButton: true
                }
            }
        },
        custom: function() {
            // get a reference to the fields
            let startDate = this.field('startDate');
            let expiredDate = this;
            // Make sure the fields are set so that .value is not undefined
            if (startDate.isSet && expiredDate.isSet) {
                if (moment(expiredDate.value).isBefore(startDate.value)){
                    return "badDate";
                }
            }
        }
    },
    type:{
        type:String,
        label:"Type",
        defaultValue: "amount",
        autoform: {
            type: 'select-radio-inline',
            options: function () {
                return [
                    {label: 'Amount', value: 'amount'},
                    {label: 'Percent', value: 'percent'}
                ]
            }
        }
    },
    amount:{
        type:Number,
        decimal:true,
        label:"Amount"
    }

});

Promotion.attachSchema(Promotion.generalSchema);
// SimpleSchema.messages({
//     badDate: 'Start date must less than expired date',
//     notDateCombinationUnique: 'The start/end date combination must be unique'
// });