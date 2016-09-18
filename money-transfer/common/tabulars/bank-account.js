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
import {Transfer} from '../collections/transfer';

// Page
Meteor.isClient && require('../../imports/pages/bank-account.html');

tabularOpts.name = 'moneyTransfer.bankAccount';
tabularOpts.collection = Transfer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_bankAccountAction},
    {data: "_id", title: "ID"},
    {data: "type", title: "Type"},
    {data: "accountId", title: "Account"},
    {
        data: "transferDate",
        title: "Input Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data:"productId", title:"Product"},
    {data:"currencyId", title:"Currency"},
    {data: "amount", title: "Amount"},
    {data: "balanceAmount", title: "Balance Amount"},
];
export const BankAccountTabular = new Tabular.Table(tabularOpts);
