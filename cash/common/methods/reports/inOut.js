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
import {ChartCash} from '../../collections/chartCash';

export const inOutReport = new ValidatedMethod({
    name: 'cash.inOutReport',
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
            selector.cashType = params.cashType;

            rptContent = Transaction.aggregate([
                {
                    $match: selector
                },
                {
                    $unwind: "$items"
                },
                {
                    $project: {
                        currencyId: 1,
                        items: 1,
                    }
                },
                {
                    $group: {
                        _id: {
                            currencyId: "$currencyId",
                            chartCashId: "$items.chartCashId"
                        },
                        sumAmount: {$sum: "$items.amount"}
                    }
                },
                {
                    $group: {
                        _id: "$_id.chartCashId",
                        amountKHR: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$_id.currencyId", "KHR"]
                                    },
                                    then: "$sumAmount",
                                    else: 0
                                }
                            }
                        },
                        amountUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$_id.currencyId", "USD"]
                                    },
                                    then: "$sumAmount",
                                    else: 0
                                }
                            }
                        },
                        amountTHB: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$_id.currencyId", "THB"]
                                    },
                                    then: "$sumAmount",
                                    else: 0
                                }
                            }
                        },
                        amountAsUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$_id.currencyId", "KHR"]},
                                    then: {$divide: ["$sumAmount", exchangeDoc.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {$eq: ["$_id.currencyId", "THB"]},
                                            then: {$divide: ["$sumAmount", exchangeDoc.rates.THB]},
                                            else: "$sumAmount"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: {_id: 1}
                },
                {
                    $group: {
                        _id: null,
                        data: {$push: "$$ROOT"},
                        totalKHR: {
                            $sum: "$amountKHR"
                        },
                        totalUSD: {
                            $sum: "$amountUSD"
                        },
                        totalTHB: {
                            $sum: "$amountTHB"
                        },
                        totalAsUSD: {
                            $sum: "$amountAsUSD"
                        }
                    }
                }
            ])[0];

            // Convert data to object
            let dataObj = {};
            rptContent.data.forEach(function (val) {
                dataObj[val._id] = val;
            });

            // Get chart
            let chartObj = {};
            ChartCash.aggregate([
                {
                    $match: {cashType: params.cashType}
                },
                {
                    $sort: {_id: 1}
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        amountKHR: {
                            $ifNull: ["$amountKHR", 0]
                        },
                        amountUSD: {
                            $ifNull: ["$amountUSD", 0]
                        },
                        amountTHB: {
                            $ifNull: ["$amountTHB", 0]
                        },
                        amountAsUSD: {
                            $ifNull: ["$amountAsUSD", 0]
                        }
                    }
                }
            ]).forEach(function (val) {
                chartObj[val._id] = val;
            });

            // Merge data
            rptContent.data = _.map(_.defaultsDeep(dataObj, chartObj), (o)=> {
                return o;
            });

            return {rptTitle, rptHeader, rptContent};
        }
    }
});
