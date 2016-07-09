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
import {FromKhmer} from '../../imports/api/collections/from-khmer.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/from-khmer.html');

tabularOpts.name = 'moneyTransfer.fromKhmer';
tabularOpts.collection = FromKhmer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_fromKhmerAction},
    {data: "_id", title: "ID"},
    {data: "code", title: "Code"},
    {data: "name", title: "Name"},
    {data: "des", title: "Description"}
];
export const FromKhmerTabular = new Tabular.Table(tabularOpts);
