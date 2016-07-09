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
import {Sender} from '../../imports/api/collections/sender.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/sender.html');

tabularOpts.name = 'moneyTransfer.sender';
tabularOpts.collection = Sender;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_senderAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "gender", title: "Gender"},
    {data: "telephone", title: "Telephone"},
    {data: "address", title: "Address"},
    {data: "des", title: "Description"}
];
export const SenderTabular = new Tabular.Table(tabularOpts);
