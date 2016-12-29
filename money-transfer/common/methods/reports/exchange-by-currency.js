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

export const exchangeByCurrencyReport = new ValidatedMethod({
    name: 'moneyTransfer.exchangeByCurrencyReport',
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
            var fDate = moment(params.repDate[0], "DD/MM/YYYY").startOf('day').toDate(); // set to 12:00 am today
            var tDate = moment(params.repDate[1], "DD/MM/YYYY").endOf('day').toDate(); // set to 23:59 pm today

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
                { $unwind: { path: '$customerDoc', preserveNullAndEmptyArrays:true } },
                { $unwind: { path: '$items', preserveNullAndEmptyArrays:true } },
                {
                    $project: {
                        exchangeDate: 1,
                        customerDoc: 1,
                        transferId: 1,
                        items: 1,

                    }
                },
                {
                    $group: {

                        _id: {
                            baseCurrency: "$items.baseCurrency",//group by currency
                            convertTo: "$items.convertTo"//group by productId
                        },
                        customerDoc: { $last: '$customerDoc' },
                        exchangeDate: { $last: '$exchangeDate' },
                        totalBaseAmount: {
                            $sum: "$items.baseAmount"
                            // $sum: {
                            //     $cond: {
                            //         if: { $eq: ["$items.baseCurrency", "USD"] },
                            //         then: { $sum: "$items.baseAmount" },
                            //         else: "$items.baseAmount"
                            //     }
                            // }
                        },
                        totalToAmount: {
                            $sum: "$items.toAmount"
                            // $sum: {
                            //     $cond: {
                            //         if: { $eq: ["$items.baseCurrency", "USD"] },
                            //         then: { $sum: "$items.toAmount" },
                            //         else: "$items.toAmount"
                            //     }
                            // }
                        },
                        exchangeItems: {
                            $addToSet: {
                                baseCurrency: '$items.baseCurrency',//add to array
                                buying: '$items.buying',//
                                selling: '$items.selling',//add to array
                                convertTo: '$items.convertTo',//
                                baseAmount: '$items.baseAmount',
                                toAmountBuying: '$items.toAmountBuying',
                                toAmount: '$items.toAmount',
                                income: '$items.income'
                            }
                        },

                    }
                },
                {
                    $project: {
                        customerDoc: 1,
                        _id: { $concat: ["$_id.baseCurrency", "-","$_id.convertTo"] },
                        exchangeDate: 1,
                        totalBaseAmount:1,
                        totalToAmount: 1,
                        exchangeItems: 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: "$$ROOT"
                        },

                        gTotalToAmount: {
                            $sum: "$totalBaseAmount"
                        },
                        // totalIncome:{
                        //     $sum: "$sumIncome"
                        // },
                        //tt:{$sum:'$gTotalTest'},

                    }
                }
            ]);
            if (exchangeDetail.length > 0) {
                data.content = exchangeDetail[0].data;
                // data.footer.totalToAmount = exchangeDetail[0].totalToAmount;
                // data.footer.totalIncome = exchangeDetail[0].totalIncome;
            }
            return data;
        }
    }
});
