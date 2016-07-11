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
import {CashIn} from '../../imports/api/collections/cash-in.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/cash-in.html');

tabularOpts.name = 'moneyTransfer.cashIn';
tabularOpts.collection = CashIn;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_cashInAction},
    {data: "_id", title: "ID"},
    {
        data: "cashInDate",
        title: "Date",
        render: function (val, type, doc) {
            return moment(val).format('YYYY-MM-DD');
        }
    },
    {data: "cash", title: "Cash In"}
    
];
export const CashInTabular = new Tabular.Table(tabularOpts);
