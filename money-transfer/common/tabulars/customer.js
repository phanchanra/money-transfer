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
import {Customer} from '../collections/customer';

// Page
Meteor.isClient && require('../../imports/pages/customer.html');

tabularOpts.name = 'moneyTransfer.customer';
tabularOpts.collection = Customer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_customerAction},
    {data: "_id", title: "ID"},
    {data: "name", title: "Name"},
    {data: "gender", title: "Gender"},
    {data: "notificationDay", title: "Notification"},
    {
        data: "dob",
        title: "Date of birth",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "telephone", title: "Telephone"},
    {data: "bankName", title: "Bank Name"},
    {data: "bankNumber", title: "Bank Number"},
    {data: "address", title: "Address"},
    {data: "email", title: "E-mail"},
];
export const CustomerTabular = new Tabular.Table(tabularOpts);
