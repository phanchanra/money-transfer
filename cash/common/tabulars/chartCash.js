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
import {ChartCash} from '../collections/chartCash.js';

// Page
Meteor.isClient && require('../../imports/pages/chartCash.html');

tabularOpts.name = 'cash.chartCash';
tabularOpts.collection = ChartCash;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.Cash_chartCashAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "cashType", title: "Type"},
    {data: "memo", title: "Memo"}
];
tabularOpts.order = [[1, 'asc']];

export const ChartCashTabular = new Tabular.Table(tabularOpts);
