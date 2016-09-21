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
import {Provider} from '../collections/provider';

// Page
Meteor.isClient && require('../../imports/pages/provider.html');

tabularOpts.name = 'moneyTransfer.provider';
tabularOpts.collection = Provider;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_providerAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {
        data: "registerDate",
        title: "Register Date",
        render: function (val, type, doc) {
            return moment(val).format('YYYY-MM-DD');
        }
    },
    {data: "status", title: "Status"},
    {data: "telephone", title: "Telephone"},
    {data: "email", title: "Email"}

];
export const ProviderTabular = new Tabular.Table(tabularOpts);
