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

import {Transaction} from '../../collections/transaction';

export const flowReport = new ValidatedMethod({
    name: 'cash.flowReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let rptTitle, rptHeader, rptContent;

            let fDate = moment(params.repDate[0]).startOf('day').toDate();
            let tDate = moment(params.repDate[1]).endOf('day').toDate();

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
            selector.transactionDate = {$gte: fDate, $lte: tDate};

            rptContent = Transaction.aggregate([
                {
                    $match: selector
                },
                {
                    $group: {
                        _id: {
                            currencyId: '$currencyId',
                            cashType: '$cashType',
                            day: {$dayOfMonth: "$transactionDate"},
                            month: {$month: "$transactionDate"},
                            year: {$year: "$transactionDate"}
                        },
                        transactionDate: {$last: "$transactionDate"},
                        totalAmount: {$sum: '$totalAmount'}
                    },
                },
                {
                    $sort: {"_id.currencyId": 1}
                },
                {
                    $group: {
                        _id: {
                            cashType: "$_id.cashType",
                            day: {$dayOfMonth: "$transactionDate"},
                            month: {$month: "$transactionDate"},
                            year: {$year: "$transactionDate"}
                        },
                        transactionDate: {$last: "$transactionDate"},
                        data: {$push: {currencyId: "$_id.currencyId", amount: "$totalAmount"}},
                        totalAsUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$_id.currencyId", "KHR"]},
                                    then: {$divide: ["$totalAmount", exchangeDoc.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {$eq: ["$_id.currencyId", "THB"]},
                                            then: {$divide: ["$totalAmount", exchangeDoc.rates.THB]},
                                            else: "$totalAmount"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {"_id.cashType": -1}
                },
                {
                    $group: {
                        _id: {
                            day: "$_id.day",
                            month: "$_id.month",
                            year: "$_id.year"
                        },
                        transactionDate: {$last: "$transactionDate"},
                        data: {
                            $addToSet: {cashType: "$_id.cashType", data: "$data", totalAsUSD: "$totalAsUSD"}
                        }
                    }
                },
                {
                    $project: {_id: 0, transactionDate: 1, data: 1}
                },
                {
                    $sort: {transactionDate: 1}
                }
            ]);

            return {rptTitle, rptHeader, rptContent};
        }
    }
});
