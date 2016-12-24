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
import {ExchangeTransaction} from '../collections/exchange-transaction';
import {Provider} from '../collections/provider';
import {Customer} from '../collections/customer';

// Page
Meteor.isClient && require('../../imports/pages/exchange-transaction.html');
//import {tmpCollection as accountWithdrawalAndDepositCount} from '../collections/tmpCollection';
tabularOpts.name = 'moneyTransfer.exchangeTransaction';
tabularOpts.collection = ExchangeTransaction;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_exchangeTransactionAction},
    {data: "_id", title: "ID"},
    {
        data: "exchangeDate",
        title: "Exchange Date",
        render: function (val, type, doc) {
            return moment(val).format('DD/MM/YYYY');
        }
    },
    {data: "customerId", title: "Customer"},
    {
        data: "transferId", title: 'Transaction Exchange'
        , render: function (val, type, doc) {
        if (val != undefined) {
            return "<button type='button' class='btn btn-block btn-warning btn-flat'>" + "From Transfer " + val + "</button>"
        } else {
            return "<button type='button' class='btn btn-block btn-info btn-flat'>Normal</button>"
        }
    }
    },
    {
        data: "items", title: "Exchange Items",
        render: function (val, type, doc) {
            var Exchange = '';
            val.forEach(function (obj) {
                if (obj != null) {

                    Exchange += '' + "Base CRC = " + obj.baseCurrency + ', ' + 'Buying = ' + obj.buying + ', ' + 'Selling = ' + obj.selling + ', ' + 'Convert To = ' + obj.convertTo + ', ' + 'Base Amount = ' + obj.baseAmount + ', ' + 'Amount Buying = ' + ' ' + numeral(obj.toAmountBuying).format('0,000.00') + ', ' + 'Amount Selling = ' + numeral(obj.toAmount).format('0,000.00') + ", " + "Income = " + obj.income + "<br>";
                }
            });
            //Exchange += '</ul>';
            return Spacebars.SafeString(Exchange);
        }
    }

];
tabularOpts.extraFields = ['items'];
export const ExchangeTransactionTabular = new Tabular.Table(tabularOpts);
