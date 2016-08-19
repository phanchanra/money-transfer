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
import {Transfer} from '../../imports/api/collections/transfer';

// Page
Meteor.isClient && require('../../imports/ui/pages/transfer.html');

tabularOpts.name = 'moneyTransfer.transfer';
tabularOpts.collection = Transfer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_transferAction},
    {data: "_id", title: "ID"},
    {data: "transferType", title: "Transfer type"},
    {
        data: "transferDate",
        title: "Transfer date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "senderId", title: "Sender"},
    {data: "senderTelephone", title: "Telephone"},
    {data: "receiverId", title: "Receiver"},
    {data: "receiverTelephone", title: "Telephone"},
];
export const TransferTabular = new Tabular.Table(tabularOpts);
