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

export const TransactionItemsSchema = new SimpleSchema({
    // itemId: {
    //     type: String,
    //     label: 'Item',
    //     autoform: {
    //         type: 'universe-select',
    //         afFieldInput: {
    //             uniPlaceholder: 'Please search... (limit 10)',
    //             optionsMethod: 'simplePos.selectOptsMethod.item'
    //         }
    //     }
    // },
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
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         return inputmaskOptions.currency();
        //     }
        // }
    },
    toAmount: {
        type: Number,
        label: 'To Amount',
        decimal: true,
        // autoform: {
        //     type: 'inputmask',
        //     inputmaskOptions: function () {
        //         return inputmaskOptions.currency();
        //     }
        // }
    }
});
