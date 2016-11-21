import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';
import fx from 'money';

// Lib
import  {CalInterest} from '../../libs/calInterest';

// Collection
import {Company} from '../../../../core/common/collections/company';
import {Branch} from '../../../../core/common/collections/branch';
import {Exchange} from '../../../../core/common/collections/exchange';

import {Borrowing} from '../../collections/borrowing';

export const borrowingBalanceReport = new ValidatedMethod({
    name: 'simplePos.borrowingBalanceReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let rptTitle, rptHeader, rptContent, rptFooter;

            let rptDate = moment(params.rptDate).endOf('day').toDate();

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
            let selector = {};
            selector.branchId = {$in: params.branchId};
            selector.currencyId = {$in: params.currencyId};
            selector.activeDate = {$lte: rptDate};
            selector.$and = [
                {
                    $or: [
                        {rescheduleDate: {$exists: false}},
                        {rescheduleDate: {$gt: rptDate}}
                    ]
                },
                {
                    $or: [
                        {closeDate: {$exists: false}},
                        {closeDate: {$gt: rptDate}}
                    ]
                }
            ];

            rptContent = Borrowing.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_borrowingPayment",
                        localField: "_id",
                        foreignField: "borrowingId",
                        as: "lastPaymentDoc"
                    }
                },
                {
                    $sort: {_id: -1}
                },
                {
                    $group: {
                        _id: "$currencyId",
                        dataByCurrency: {$addToSet: "$$ROOT"},
                        subTotalAmount: {
                            $sum: "$borrowingAmount"
                        },
                        subTotalInterest: {
                            $sum: "$projectInterest"
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
                        totalAmountAsUSD: calTotal("$subTotalAmount", exchangeDoc),
                        totalInterestAsUSD: calTotal("$subTotalInterest", exchangeDoc)
                    }
                }
            ])[0];

            // Cal principal, interest balance
            let tmpContentData = [], totalPrincipalBalAsUSD = 0, totalInterestBalAsUSD = 0;
            _.forEach(rptContent.data, function (val) {

                let tmpValByCurrency = [], sumOfPrincipalBal = 0, sumOfInterestBal = 0;
                _.forEach(val.dataByCurrency, function (valByCurrency) {
                    // Check last payment
                    let dateFrom = valByCurrency.borrowingDate;
                    let principalBal = valByCurrency.borrowingAmount;
                    let oldInterest = 0;

                    if (valByCurrency.lastPaymentDoc.length > 0) {
                        let sortPayment = _.reverse(_.sortBy(valByCurrency.lastPaymentDoc, (o)=> {
                            return o._id;
                        }));
                        let findPayment = _.find(sortPayment, (o)=> {
                            return moment(o.paidDate).isSameOrBefore(rptDate);
                        });

                        if (findPayment) {
                            dateFrom = findPayment.paidDate;
                            principalBal = findPayment.balanceDoc.principal;
                            oldInterest = findPayment.balanceDoc.interest;
                        }
                    }

                    let numOfDay = moment(rptDate).diff(dateFrom, 'days');
                    let currentInterest = CalInterest({
                        amount: principalBal,
                        numOfDay: numOfDay,
                        interestRate: valByCurrency.interestRate,
                        method: 'M',
                        dayInMethod: 30,
                        currencyId: valByCurrency.currencyId
                    });

                    let interestBal = oldInterest + currentInterest;
                    valByCurrency.balance = {
                        numOfDay: numOfDay,
                        principal: principalBal,
                        interest: interestBal,
                    };

                    // Sum of currency
                    sumOfPrincipalBal += principalBal;
                    sumOfInterestBal += interestBal;

                    tmpValByCurrency.push(valByCurrency);
                });

                val.dataByCurrency = tmpValByCurrency;
                val.subTotalPrincipalBal = sumOfPrincipalBal;
                val.subTotalInterestBal = sumOfInterestBal;

                // Total as USD
                fx.rates = exchangeDoc.rates;
                totalPrincipalBalAsUSD += fx(sumOfPrincipalBal).from(val._id).to("USD");
                totalInterestBalAsUSD += fx(sumOfInterestBal).from(val._id).to("USD");

                tmpContentData.push(val);

            });

            rptContent.data = tmpContentData;
            rptContent.totalPrincipalBalAsUSD = totalPrincipalBalAsUSD;
            rptContent.totalInterestBalAsUSD = totalInterestBalAsUSD;

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