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
import {Receiver} from '../../imports/api/collections/receiver.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/receiver.html');

tabularOpts.name = 'moneyTransfer.receiver';
tabularOpts.collection = Receiver;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_receiverAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "gender", title: "Gender"},
    {data: "telephone", title: "Telephone"},
    {data: "address", title: "Address"},
    {data: "des", title: "Description"}
];
export const ReceiverTabular = new Tabular.Table(tabularOpts);
