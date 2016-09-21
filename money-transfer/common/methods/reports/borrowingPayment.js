import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company';
import {Branch} from '../../../../core/common/collections/branch';
import {Exchange} from '../../../../core/common/collections/exchange';

import {BorrowingPayment} from '../../collections/borrowingPayment';

export const borrowingPaymentReport = new ValidatedMethod({
    name: 'simplePos.borrowingPaymentReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(2000);

            let rptTitle, rptHeader, rptContent, rptFooter;

            let dateFrom = moment(params.rptDate[0]).startOf('day').toDate();
            let dateTo = moment(params.rptDate[1]).endOf('day').toDate();

            // --- Title ---
            rptTitle = Company.findOne();

            // --- Header ---
            // Branch
            let branchDoc = Branch.find({_id: {$in: params.branchId}});
            params.branchHeader = _.map(branchDoc.fetch(), function (val) {
                return `${val._id} : ${val.enName}`;
            });

            // Exchange
            let exchangeDoc = Exchange.findOne(params.exchangeId);
            params.exchangeHeader = JSON.stringify(exchangeDoc.rates, null, ' ');

            rptHeader = params;

            // --- Content ---
            let selector = {}, selector2 = {};
            selector.branchId = {$in: params.branchId};
            selector.status = {$in: params.status};
            selector.paidDate = {$gte: dateFrom, $lte: dateTo};

            selector2["borrowingDoc.currencyId"] = {$in: params.currencyId};

            rptContent = BorrowingPayment.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_borrowing",
                        localField: "borrowingId",
                        foreignField: "_id",
                        as: "borrowingDoc"
                    }
                },
                {
                    $unwind: "$borrowingDoc"
                },
                {
                    $match: selector2
                },
                {
                    $sort: {"paidDate": -1, _id: -1}
                },
                {
                    $group: {
                        _id: "$borrowingDoc.currencyId",
                        dataByCurrency: {$addToSet: "$$ROOT"},
                        subTotalPaid: {
                            $sum: "$paidAmount"
                        },
                        subTotalPrincipalBal: {
                            $sum: "$balanceDoc.principal"
                        },
                        subTotalInterestBal: {
                            $sum: "$balanceDoc.Interest"
                        }
                    }
                },
                {
                    $sort: {_id: -1}
                },
                {
                    $group: {
                        _id: null,
                        data: {$addToSet: "$$ROOT"},
                        totalPaidAsUSD: calTotal("$subTotalPaid", exchangeDoc),
                        totalPrincipalBalAsUSD: calTotal("$subTotalPrincipalBal", exchangeDoc),
                        totalInterestBalAsUSD: calTotal("$subTotalInterestBal", exchangeDoc)
                    }
                }
            ])[0];

            return {rptTitle, rptHeader, rptContent};
        }
    }
});

function calTotal(fieldName, exchange) {
    return {
        $sum: {
            $cond: {
                if: {$eq: ["$_id", "KHR"]},
                then: {$divide: [fieldName, exchange.rates.KHR]},
                else: {
                    $cond: {
                        if: {$eq: ["$_id", "THB"]},
                        then: {$divide: [fieldName, exchange.rates.THB]},
                        else: fieldName
                    }
                }
            }
        }
    }
}