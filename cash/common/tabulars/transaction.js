import {Meteor} from 'meteor/meteor';
import {Templet} from 'meteor/templating';
import {Tabular} from 'meteor/aldeed:tabular';
import {EJSON} from 'meteor/ejson';
import {moment} from 'meteor/momentjs:moment';
import {_} from 'meteor/erasaur:meteor-lodash';
import {numeral} from 'meteor/numeral:numeral';
import {lightbox} from 'meteor/theara:lightbox-helpers';

// Lib
import {tabularOpts} from '../../../core/common/libs/tabular-opts.js';

// Collection
import {Transaction} from '../collections/transaction.js';

// Page
Meteor.isClient && require('../../imports/pages/transaction.html');

tabularOpts.name = 'cash.transaction';
tabularOpts.collection = Transaction;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.Cash_transactionAction},
    {data: "_id", title: "ID"},
    {
        data: "transactionDate",
        title: "Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "cashType", title: "Type"},
    {data: "currencyId", title: "Currency"},
    {
        data: "totalAmount",
        title: "Total",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {data: "voucherId", title: "Voucher"},
    {data: "refFrom", title: "Ref From"}
];

export const TransactionTabular = new Tabular.Table(tabularOpts);
