import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {ExchangeTransaction} from '../../collections/exchange-transaction';
import {Exchange} from '../../../../core/common/collections/exchange'

export const exchangeDetailReport = new ValidatedMethod({
    name: 'moneyTransfer.exchangeDetailReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);
            let data = {
                title: {},
                header: {},
                content: [{index: 'No Result'}],
                footer: {}
            };
            let branch = params.branch;
            // let date = params.repDate;
            // let fDate = moment(date[0]).toDate();
            // let tDate = moment(date[1]).add(1, 'days').toDate();
            let fDate = moment(params.repDate[0], "DD/MM/YYYY").startOf('day').toDate(); // set to 12:00 am today
            let tDate = moment(params.repDate[1], "DD/MM/YYYY").endOf('day').toDate(); // set to 23:59 pm today
            let exchange = Exchange.findOne(params.exchange);
            params.exchangeObj = moment(exchange.exDate).format('DD/MM/YYYY') + ' ' + exchange.base + '  ' + exchange.rates.USD + '=' + exchange.rates.KHR + 'KHR' + ' | ' + exchange.rates.THB + 'THB';

            /****** Title *****/
            data.title = Company.findOne();
            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let selector = {};
            selector.exchangeDate = {
                $gte: fDate,
                $lte: tDate
            };
            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            let exchangeDetail = ExchangeTransaction.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {$unwind: {path: '$customerDoc', preserveNullAndEmptyArrays:true}},
                {$unwind: {path: '$items', preserveNullAndEmptyArrays:true}},
                {
                    $project: {
                        exchangeDate: 1,
                        customerDoc: 1,
                        transferId:1,
                        items: 1,
                        sumToAmount: {
                            $sum: {
                                $cond: {//condition sum by currency and product
                                    if: { $eq: ["$items.convertTo", "THB"] },
                                    then: { $divide: ["$items.toAmount", exchange.rates.THB] },
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$items.convertTo', 'KHR']
                                            },
                                            then: { $divide: ["$items.toAmount", exchange.rates.KHR] },
                                            else: "$items.toAmount"
                                        }
                                    }
                                }
                            }
                        },
                        sumIncome:{
                            $sum: {
                                $cond: {//condition sum by currency and product
                                    if: { $eq: ["$items.convertTo", "THB"] },
                                    then: { $divide: ["$items.income", exchange.rates.THB] },
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$items.convertTo', 'KHR']
                                            },
                                            then: { $divide: ["$items.income", exchange.rates.KHR] },
                                            else: "$items.income"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$_id',
                        exchangeDate:{$last: "$exchangeDate"},
                        transferId:{$last: "$transferId"},
                        customerDoc:{$last: "$customerDoc"},

                        items:{
                            $addToSet: {
                                baseCurrency: '$items.baseCurrency',//add to array
                                buying: '$items.buying',//
                                selling: '$items.selling',//add to array
                                convertTo: '$items.convertTo',//
                                baseAmount:'$items.baseAmount',
                                toAmountBuying:'$items.toAmountBuying',
                                toAmount:'$items.toAmount',
                                income:'$items.income'
                            }
                        },
                        sumToAmount: {$sum: '$sumToAmount'},
                        sumIncome: {$sum: '$sumIncome'},
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: "$$ROOT"
                        },
                        totalToAmount: {
                            $sum: "$sumToAmount"
                        },
                        totalIncome:{
                            $sum: "$sumIncome"
                        }
                    }
                }
            ]);

            if (exchangeDetail.length > 0) {
                data.content = exchangeDetail[0].data;
                data.footer.totalToAmount = exchangeDetail[0].totalToAmount;
                data.footer.totalIncome = exchangeDetail[0].totalIncome;
            }
            return data;
        }
    }
});
