import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {ReactiveVar} from 'meteor/reactive-var';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {SelectOpts} from '../../imports/libs/select-opts.js';

// Method
//import {lookupItem} from '../../common/methods/lookup-item.js';
let baseCurrencySymbol = new ReactiveVar();
let convertToSymbol = new ReactiveVar();
if (Meteor.isClient) {
    Tracker.autorun(function () {
        if (Session.get('baseCurrencySymbol')) {
            baseCurrencySymbol.set(Session.get('baseCurrencySymbol'));
        }
        if(Session.get('convertToSymbol')){
            convertToSymbol.set(Session.get('convertToSymbol'))
        }
    });
}
export const TransactionItemsSchema = new SimpleSchema({
    baseCurrency: {
        type: String,
        label: 'Base Currency',
        autoform: {
            options: function () {
                return SelectOpts.currency(true);
            }
        }
    },
    convertTo: {
        type: String,
        label: 'Convert To',
        autoform: {
            options: function () {
                return SelectOpts.currencyExchange(true);
            }
        }
    },
    baseAmount: {
        type: Number,
        label: 'Base Amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let baseSymbol = baseCurrencySymbol.get();
                if (baseSymbol) {
                    return inputmaskOptions.currency({prefix: `${baseSymbol} `});
                }
            }
        }
    },
    toAmount: {
        type: Number,
        label: 'To Amount',
        decimal: true,
        autoform: {
            type: 'inputmask',
            inputmaskOptions: function () {
                let convertSymbol = convertToSymbol.get();
                if (convertSymbol) {
                    return inputmaskOptions.currency({prefix: `${convertSymbol} `});
                }
            }
        }
    }
});
