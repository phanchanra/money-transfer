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
import {Fee} from '../collections/fee';
import {Product} from '../collections/product';

// Page
Meteor.isClient && require('../../imports/pages/fee');
//Meteor.isClient && require('../../imports/pages/bank-account');
import {tmpCollection as accountWithdrawalAndDepositCount} from '../collections/tmpCollection';
tabularOpts.name = 'moneyTransfer.fee';
tabularOpts.collection = Fee;
tabularOpts.columns = [
    {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.MoneyTransfer_feeAction},
    {data: "_id", title: "ID"},
    {
        data: 'productId',
        title: "Product",
        tmpl: Meteor.isClient && Template.MoneyTransfer_feeProduct
    },
    {data: "currencyId", title: "Currency"},
    // {data: "accountId", title: "Account"},
    // {
    //     data: "openingAmount",
    //     title: "Opening balance",
    //     render: function (val, type, doc) {
    //         return numeral(val).format('0,000.00')
    //     }
    // },
    {
        data: 'productId',
        title: 'CD/CW',
        render: function (val, type, doc) {
//             let button = `<a href="/money-transfer/bank-account/${val}/${doc.currencyId}" type="button" name="add-balance" class="btn btn-default add-balance" title="Add opening balance">+</a>
// `;
            let url = `/money-transfer/bank-account/${val}/${doc.currencyId}`;
            try {
                let cdCw = accountWithdrawalAndDepositCount.findOne({
                    productId: val,
                    currencyId: doc.currencyId,
                });
                if (!cdCw) {
                    Meteor.call('getAccountDepositAndWithdrawal', {
                        productId: val,
                        currencyId: doc.currencyId,
                    }, function (err, result) {
                        accountWithdrawalAndDepositCount.insert({
                            productId: val,
                            currencyId: doc.currencyId,
                            cd: result.cd,
                            cw: result.cw
                        })

                    });
                    let cdCw = accountWithdrawalAndDepositCount.findOne({
                        productId: val,
                        currencyId: doc.currencyId
                    });
                    //return cdCw.cd + ' / ' + cdCw.cw + ' ' + button;
                    return `<a href="${url}" type="button" class="btn btn-default" title="Add opening balance">` + cdCw.cd + ' / ' + cdCw.cw + `</a>`;
                }
                //return cdCw.cd + ' / ' + cdCw.cw + ' ' + button;
                return `<a href="${url}" type="button" class="btn btn-default" title="Add opening balance">` + cdCw.cd + ' / ' + cdCw.cw + `</a>`;

            } catch (e) {

            }


        }
    }
];
tabularOpts.extraFields = ['service'];
export const FeeTabular = new Tabular.Table(tabularOpts);
