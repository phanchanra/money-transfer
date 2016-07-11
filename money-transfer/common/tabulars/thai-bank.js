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
import {ThaiBank} from '../../imports/api/collections/thai-bank.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/thai-bank.html');

tabularOpts.name = 'moneyTransfer.thaiBank';
tabularOpts.collection = ThaiBank;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_thaiBankAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "des", title: "Description"}
];
export const ThaiBankTabular = new Tabular.Table(tabularOpts);
