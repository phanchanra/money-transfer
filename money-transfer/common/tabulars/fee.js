import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Templete} from 'meteor/templating';
import {Tabular} from 'meteor/aldeed:tabular';
import {EJSON} from 'meteor/ejson';
import {moment} from 'meteor/momentjs:moment';
import {_} from 'meteor/erasaur:meteor-lodash';
import {numeral} from 'meteor/numeral:numeral';
import {lightbox} from 'meteor/theara:lightbox-helpers';

// Lib
import {tabularOpts} from '../../../core/common/libs/tabular-opts.js';

// Collection
import {Fee} from '../../imports/api/collections/fee';
import {Product} from '../../imports/api/collections/product';

// Page
Meteor.isClient && require('../../imports/ui/pages/fee');
//Meteor.isClient && require('../../imports/ui/pages/bank-account');

tabularOpts.name = 'moneyTransfer.fee';
tabularOpts.collection = Fee;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_feeAction},
    {data: "_id", title: "ID"},
    {
        data: 'productId',
        title: "Product",
        tmpl: Meteor.isClient && Template.MoneyTransfer_feeProduct
    },
    {data: "currencyId", title: "Currency"},
    // {data: "accountId", title: "Account"},
    // {
    //     data: "openingAmount",
    //     title: "Opening balance",
    //     render: function (val, type, doc) {
    //         return numeral(val).format('0,000.00')
    //     }
    // },
    {title: 'Add Opening Balance', tmpl: Meteor.isClient && Template.MoneyTransfer_addOpeningBalance}
];
tabularOpts.extraFields = ['service'];
export const FeeTabular = new Tabular.Table(tabularOpts);
