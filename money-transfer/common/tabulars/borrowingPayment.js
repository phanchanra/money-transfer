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
import {BorrowingPayment} from '../collections/borrowingPayment';

// Page
Meteor.isClient && require('../../imports/pages/borrowingPayment.html');

tabularOpts.name = 'moneyTransfer.borrowingPayment';
tabularOpts.collection = BorrowingPayment;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_borrowingPaymentAction},
    {data: "_id", title: "ID"},
    {
        data: "paidDate",
        title: "Paid Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {
        data: "dueDoc.totalAmount",
        title: "Due Amount",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "paidAmount",
        title: "Paid Amount",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "balanceDoc.principal",
        title: "Principal Bal",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "balanceDoc.interest",
        title: "Interest Bal",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "status",
        title: "Status",
        render: function (val, type, doc) {
            if (val == 'Close') {
                val = `<span class="text-red">${val}</span>`;
            }
            return val;
        }
    },
];
tabularOpts.extraFields = ['borrowingId'];

export const BorrowingPaymentTabular = new Tabular.Table(tabularOpts);
