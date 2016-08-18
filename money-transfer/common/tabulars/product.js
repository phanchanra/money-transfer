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
import {Product} from '../../imports/api/collections/product';

// Page
Meteor.isClient && require('../../imports/ui/pages/product.html');

tabularOpts.name = 'moneyTransfer.product';
tabularOpts.collection = Product;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_productAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {
        data: "registerDate",
        title: "Reg Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "status", title: "Status"},
];
export const ProductTabular = new Tabular.Table(tabularOpts);
