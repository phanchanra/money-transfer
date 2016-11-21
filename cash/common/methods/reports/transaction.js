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

export const transactionReport = new ValidatedMethod({
    name: 'cash.transactionReport',
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
            selector.cashType = {$in: params.cashType};
            selector.currencyId = {$in: params.currencyId};
            selector.transactionDate = {$gte: fDate, $lte: tDate};

            rptContent = Transaction.aggregate([
                {
                    $match: selector
                },
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "cash_chart",
                        localField: "items.chartCashId",
                        foreignField: "_id",
                        as: "itemDoc"
                    }
                },
                {
                    $unwind: "$itemDoc"
                },
                {
                    $project: {
                        _id: 1,
                        transactionDate: 1,
                        cashType: 1,
                        currencyId: 1,
                        voucherId: 1,
                        des: 1,
                        branchId: 1,
                        totalAmount: 1,
                        items: 1,
                        itemsDoc: 1,
                        chartCashLabel: {$concat: ["$itemDoc._id", " : ", "$itemDoc.name"]}
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        transactionDate: {$last: "$transactionDate"},
                        cashType: {$last: "$cashType"},
                        currencyId: {$last: "$currencyId"},
                        voucherId: {$last: "$voucherId"},
                        des: {$last: "$des"},
                        branchId: {$last: "$branchId"},
                        totalAmount: {$last: "$totalAmount"},
                        items: {
                            $addToSet: {
                                _id: "$items.chartCashId",
                                chartCashId: "$items.chartCashId",
                                chartCashLabel: "$chartCashLabel",
                                amount: "$items.amount"
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: "$currencyId",
                        dataByCurrency: {$addToSet: "$$ROOT"},
                        sumByCurrency: {$sum: "$totalAmount"}
                    }
                },
                {
                    $sort: {_id: -1}
                },
                {
                    $group: {
                        _id: null,
                        data: {$addToSet: "$$ROOT"},
                        sumAmount: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$_id", "KHR"]},
                                    then: {$divide: ["$sumByCurrency", exchangeDoc.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {$eq: ["$_id", "THB"]},
                                            then: {$divide: ["$sumByCurrency", exchangeDoc.rates.THB]},
                                            else: "$sumByCurrency"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ])[0];

            return {rptTitle, rptHeader, rptContent};
        }
    }
});
