import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {Session} from 'meteor/session';
import {ReactiveVar} from 'meteor/reactive-var';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Method
import {SelectOptsMethod} from '../methods/select-opts-method';

export const ItemsSchema = new SimpleSchema({
    chartCashId: {
        type: String,
        label: 'Chart cash',
        autoform: {
            type: 'universe-select',
            afFieldInput: {
                uniPlaceholder: 'Please search... (limit 10)',
                optionsPlaceholder: 'Please search... (limit 10)',
                optionsMethod: 'cash.selectOptsMethod.chartCash',
                optionsMethodParams: function () {
                    if (Meteor.isClient) {
                        return {cashType: Session.get('cashType')};
                    }
                }
            }
        }
    },
    amount: {
        type: Number,
        label: 'Amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                return inputmaskOptions.currency({prefix: ''});
            }
        }
    }
});
