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
import {Transfer} from '../collections/transfer';

// Page
Meteor.isClient && require('../../imports/pages/transfer.html');

tabularOpts.name = 'moneyTransfer.transfer';
tabularOpts.collection = Transfer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_transferAction},
    {data: "_id", title: "ID"},
    {data: "type", title: "type"},
    //{data: "productId", title: "Product"},
    {
        data: 'productId',
        title: "Product",
        tmpl: Meteor.isClient && Template.MoneyTransfer_productShowAction
    },
    {
        data: "transferDate",
        title: "Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "senderId", title: "Sender"},
    {data: "senderTelephone", title: "Tel"},
    {data: "receiverId", title: "Receiver"},
    {data: "receiverTelephone", title: "Tel"},
    {data: "currencyId", title: "Cur"},
    {data: "amount", title: "Amount"},
    {data: "customerFee", title: "Cus Fee"},
    {data: "discountFee", title: "Dis Fee"},
    {data: "totalFee", title: "Total Fee"},
    {data: "agentFee", title: "Agent Fee"},
    {data: "totalAmount", title: "Total Amount"},
    {data: "balanceAmount", title: "Bal Amount"}

];
tabularOpts.extraFields=['feeDoc'];
export const TransferTabular = new Tabular.Table(tabularOpts);
