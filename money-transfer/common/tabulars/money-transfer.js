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
import {MoneyTransfer} from '../../imports/api/collections/money-transfer';
import {Supplier} from '../../imports/api/collections/supplier';
import {Customer} from '../../imports/api/collections/customer.js';

// Page
Meteor.isClient && require('../../imports/ui/pages/money-transfer.html');
tabularOpts.name = 'moneyTransfer.moneyTransfer';
tabularOpts.collection = MoneyTransfer;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_fromThaiAction},
    {data: "_id", title: "ID"},
    {
        data: "transferDate",
        title: "Transfer Date",
        render: function (val, type, doc) {
            return moment(val).format('YYYY-MM-DD');
        }
    },
    {data: "invoice", title: "Invoice"},
    // {
    //     data: "thaiBankId",
    //     title: "Thai Bank",
    //     render:function (val, type, doc) {
    //         let supplier=Supplier.findOne({_id:val});
    //         if(supplier){
    //             return supplier.name;
    //         }
    //     }
    //
    // },
    {data: "code", title: "Code"},
    {
        data: "senderId",
        title: "Sender",
        render:function (val, type, doc) {
            let sender=Customer.findOne({_id:val});
            if(sender){
                return sender.name;
            }
        }
    },
    {
        data: "receiverId",
        title: "Receiver",
        render:function (val, type, doc) {
            let sender=Customer.findOne({_id:val});
            if(sender){
                return sender.name;
            }
        }
    },
    {data: "currency", title: "Currency"},
    {
        data: "amount",
        title: "Amount",
        render:function (val, type, doc) {
            return numeral(val).format('0,000.00')
        }
    },
    {
        data: "amountFee",
        title: "Fee Amount",
        render:function (val, type, doc) {
            return numeral(val).format('0,000.00')
        }
    },
    {
        data: "exchange",
        title: "Exchange",
        render: function (val, type, doc) {
            var Exchange = '';
            val.forEach(function (obj) {
                if (obj != null) {
                    Exchange += '&nbsp;&nbsp;&nbsp;&nbsp;'+
                        'From ='+' '+ numeral(obj.fromAmount).format('0,000.00') +', '+ 'To ='+' '+ numeral(obj.toAmount).format('0,000.00')+ obj.currency+",";
                }
            });
            //Exchange += '</ul>';
            return Spacebars.SafeString(Exchange.slice(24, -1));
        }

        // render: function (val, type, doc) {
        //     return JSON.stringify(val).slice(1, JSON.stringify(val).length - 1);
        // }
    },
    {
        data: "remainAmount", 
        title: "Remain Amount",
        render:function (val, type, doc) {
            return numeral(val).format('0,000.00')
        }
    }
    // ,
    // {data: "rates", title: "Rates",
    //     render:function(val,type,doc){
    //         var str = "";
    //         $.each(val, function (key, val) {
    //             str += key + " = " + val + "<br>";
    //         });
    //         return Spacebars.SafeString(str);
    //     }
    // }
];
tabularOpts.extraFields = ['transferType', 'feeType', 'status'];
export const MoneyTransferTabular = new Tabular.Table(tabularOpts);
