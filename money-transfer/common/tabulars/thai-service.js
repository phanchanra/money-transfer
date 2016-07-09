import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Template} from 'meteor/templating';
import {Tabular} from 'meteor/aldeed:tabular';
import {EJSON} from 'meteor/ejson';
import {moment} from 'meteor/momentjs:moment';
import {_} from 'meteor/erasaur:meteor-lodash';
import {numeral} from 'meteor/numeral:numeral';
import {lightbox} from 'meteor/theara:lightbox-helpers';

// Lib
import {tabularOpts} from '../../../core/common/libs/tabular-opts.js';

// Collection
import {ThaiService} from '../../imports/api/collections/thai-service.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/thai-service.html');

tabularOpts.name = 'moneyTransfer.thaiService';
tabularOpts.collection = ThaiService;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_thaiServiceAction},
    {data: "_id", title: "ID"},
    {data: "fromAmount", title: "From Amount"},
    {data: "toAmount", title: "To Amount"},
    {data: "fee", title: "Fee"}
];
export const ThaiServiceTabular = new Tabular.Table(tabularOpts);
