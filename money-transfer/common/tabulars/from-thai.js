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
import {FromThai} from '../../imports/api/collections/from-thai.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/from-thai.html');

tabularOpts.name = 'moneyTransfer.fromThai';
tabularOpts.collection = FromThai;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_fromThaiAction},
    {data: "_id", title: "ID"},
    {data: "customerId", title: "Customer ID"},
    {data: "thaiBankId", title: "Thai Bank ID"},
    {data: "code", title: "code"},
    {data: "thaiServiceId", title: "Thai Service ID"},
    {data: "time", title: "Time"},
    {data: "transferDate", title: "Transfer Date"},
    {data: "amount", title: "Amount"},
    {data: "serviceAmount", title: "Service Amount"}
];
export const FromThaiTabular = new Tabular.Table(tabularOpts);
