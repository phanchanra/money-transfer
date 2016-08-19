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
import {Fee} from '../../imports/api/collections/fee';

// Page
Meteor.isClient && require('../../imports/ui/pages/fee');

tabularOpts.name = 'moneyTransfer.fee';
tabularOpts.collection = Fee;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_feeAction},
    {data: "_id", title: "ID"},
    {data: "productId", title: "Product"},
    {data: "currencyId", title: "Currency"},
    {data: "accountId", title: "Account"},
    {data: "openingAmount", title: "Opening balance"},
];
export const FeeTabular = new Tabular.Table(tabularOpts);
