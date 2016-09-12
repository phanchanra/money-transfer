import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {Transfer} from '../../collections/transfer';
import {Exchange} from '../../../../core/common/collections/exchange'

export const depositWithdrawalReport = new ValidatedMethod({
    name: 'moneyTransfer.depositWithdrawalReport',
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

            // let date = _.trim(_.words(params.date, /[^To]+/g));
            let branch = params.branch;
            let product = params.product;
            let type = params.type;
            let date = params.repDate;
            let fDate = moment(date[0]).toDate();
            let tDate = moment(date[1]).add(1, 'days').toDate();
            //let exchangeId = params.exchange;
            let exchange = Exchange.findOne(params.exchange);
            params.exchangeObj = moment(exchange.exDate).format('DD/MM/YYYY') + ' ' + exchange.base + '  ' + exchange.rates.USD + '=' + exchange.rates.KHR + 'KHR' + ' | ' + exchange.rates.THB + 'THB';


            /****** Title *****/
            data.title = Company.findOne();

            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let content = [];
            let selector = {};
            selector.transferDate = {
                $gte: fDate,
                $lte: tDate
            };
            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            if (!_.isEmpty(product)) {
                selector.productId = {$in: product};
            }
            if (!_.isEmpty(type)) {
                selector.type = {$in: type};
            }

            let transfers = Transfer.aggregate([
                {
                    $match: selector
                },
                {
                    $project: {
                        coefficient: {
                            $multiply: [{
                                $cond: [{$eq: ["$type", "CW"]}, -1, 1]
                            }, 1]
                        },
                        productId: 1,
                        amount: 1,
                        currencyId: 1,
                        transferDate: 1,
                        type: 1,
                        accountId:1
                    },

                },
                {
                    $lookup: {
                        from: "moneyTransfer_product",
                        localField: "productId",
                        foreignField: "_id",
                        as: "productDoc"
                    }
                },
                {

                    $group: {
                        _id: '$currencyId',
                        subAmount: {
                            $sum: {$multiply: ["$amount", "$coefficient"]}

                        },
                        totalAmountUSD: {
                            $sum: {

                                $cond: {
                                    if: {
                                        $eq: ["$currencyId", "KHR"]
                                    },
                                    then: {$divide: [{$multiply: ["$amount", "$coefficient"]}, exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', "THB"],
                                            },
                                            then: {$divide: [{$multiply: ["$amount", "$coefficient"]}, exchange.rates.THB]},
                                            else: {$multiply: ["$amount", "$coefficient"]}
                                        }
                                    }
                                }
                            }
                        },
                        productsCDCW: {
                            $addToSet: '$$ROOT'
                        }

                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: '$$ROOT'
                        },
                        totalAmount: {$sum: '$totalAmountUSD'},
                    }
                }

            ]);
            if (transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.totalAmount = transfers[0].totalAmount;
            }
            console.log(data);
            return data
        }
    }
});
