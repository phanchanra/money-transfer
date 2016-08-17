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
import {Service} from '../../imports/api/collections/service';

// Page
Meteor.isClient && require('../../imports/ui/pages/service.html');

tabularOpts.name = 'moneyTransfer.service';
tabularOpts.collection = Service;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_serviceAction},
    {data: "_id", title: "ID"},
    {
        data: "registerDate",
        title: "Register Date",
        render: function (val, type, doc) {
            return moment(val).format('YYYY-MM-DD');
        }
    },
    {data: "fromAmount", title: "From Amount"},
    {data: "toAmount", title: "To Amount"},
    {data: "fee", title: "Fee"},
    {data: "supplierFee", title: "Supplier Fee"},
    {data: "profit", title: "Profit"}

];
export const ServiceTabular = new Tabular.Table(tabularOpts);
