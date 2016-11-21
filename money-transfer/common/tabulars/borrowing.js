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
import {Borrowing} from '../collections/borrowing';

// Page
Meteor.isClient && require('../../imports/pages/borrowing.html');

tabularOpts.name = 'moneyTransfer.borrowing';
tabularOpts.collection = Borrowing;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_borrowingAction},
    {data: "_id", title: "ID"},
    {
        data: "_customerDoc.name",
        title: "Customer",
    },
    {data: "borrowingType", title: "Type"},
    {
        data: "borrowingDate",
        title: "Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "term", title: "Term"},
    {
        data: "maturityDate",
        title: "Maturity Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {
        data: "interestRate",
        title: "Rate (%)",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {data: "currencyId", title: "CRC"},
    {
        data: "borrowingAmount",
        title: "Borrowing Amount",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "projectInterest",
        title: "Project Interest",
        render: function (val, type, doc) {
            return numeral(val).format('0,0.00');
        }
    },
    {
        data: "status",
        title: "Status",
        tmpl: Meteor.isClient && Template.MoneyTransfer_borrowingStatusAction
    },
];

export const BorrowingTabular = new Tabular.Table(tabularOpts);
