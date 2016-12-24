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
import {ExchangeRate} from '../collections/exchange-rate';
import {Product} from '../collections/product';

// Page
Meteor.isClient && require('../../imports/pages/exchange-rate.html');
//import {tmpCollection as accountWithdrawalAndDepositCount} from '../collections/tmpCollection';
tabularOpts.name = 'moneyTransfer.exchangeRate';
tabularOpts.collection = ExchangeRate;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_exchangeRateAction},
    {data: "_id", title: "ID"},
    {
        data: 'providerId',
        title: "Provider",
        // tmpl: Meteor.isClient && Template.MoneyTransfer_exchangeRateProductShowAction
    },
    {
        data: "exchangeDate",
        title: "Exchange Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    }

];
tabularOpts.extraFields = ['convertCurrency'];
export const ExchangeRateTabular = new Tabular.Table(tabularOpts);
