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
import {Exchange} from '../../imports/api/collections/exchange.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/exchange.html');

tabularOpts.name = 'moneyTransfer.exchange';
tabularOpts.collection = Exchange;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_exchangeAction},
    {data: "_id", title: "ID"},
    {
        data: "Date",
        title: "Date",
        render: function (val, type, doc) {
            return moment(val).format('YYYY-MM-DD');
        }
    }
    ,
    {
        data: "baseKhr", title: "KHR BASE",
        render:function(val,type,doc){
            var str = "";
            $.each(val, function (key, val) {
                str += '&nbsp;&nbsp;&nbsp;&nbsp;'+key + " = " + numeral(val).format('0,000.00') + ",";
            });
            return Spacebars.SafeString(str.slice(24, -1));
        }
    },
    {
        data: "baseUsd", title: "USD BASE",
        render:function(val,type,doc){
            var str = "";
            $.each(val, function (key, val) {
                str += '&nbsp;&nbsp;&nbsp;&nbsp;'+key + " = " + numeral(val).format('0,000.00') + ",";
            });
            return Spacebars.SafeString(str.slice(24, -1));
        }
    },
    {
        data: "baseThb", title: "THB BASE",
        render:function(val,type,doc){
            var str = "";
            $.each(val, function (key, val) {
                str += '&nbsp;&nbsp;&nbsp;&nbsp;'+key + " = " + numeral(val).format('0,000.00') + ",";
            });
            return Spacebars.SafeString(str.slice(24, -1));
        }
    }

];
export const ExchangeTabular = new Tabular.Table(tabularOpts);
