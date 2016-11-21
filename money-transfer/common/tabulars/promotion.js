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
import {Promotion} from '../collections/promotion';

// Page
Meteor.isClient && require('../../imports/pages/promotion.html');

tabularOpts.name = 'moneyTransfer.promotion';
tabularOpts.collection = Promotion;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_promotionAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {
        data: "startDate",
        title: "Start Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {
        data: "expiredDate",
        title: "Expired Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "type", title: "Type"},
    {data: "amount", title: "Amount"},
];
export const PromotionTabular = new Tabular.Table(tabularOpts);
