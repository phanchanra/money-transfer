import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/imports/api/collections/company.js';
import {Transfer} from '../../../imports/api/collections/transfer';
import {Exchange} from '../../../../core/imports/api/collections/exchange'

export const transferTransactionReport = new ValidatedMethod({
    name: 'moneyTransfer.transferTransactionReport',
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
            let exchangeId = params.exchange;
            let exchange = Exchange.findOne(exchangeId);
            params.exchangeObj = moment(exchange.exDate).format('DD/MM/YYYY') + ' ' + exchange.base + '  ' + exchange.rates.USD + '=' + exchange.rates.KHR + 'KHR' + ' | ' + exchange.rates.THB + 'THB';

            /****** Title *****/
            data.title = Company.findOne();
            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let
                content = [];
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
            //let index = 1;
            // Transfer.find(selector)
            //     .forEach(function (obj) {
            //         // Do something
            //         obj.index = index;
            //
            //         content.push(obj);
            //
            //         index++;
            //     });
            //
            // if (content.length > 0) {
            //     data.content = content;
            // }
            ////
            let transfers = Transfer.aggregate([
                {
                    $match: selector
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
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "senderId",
                        foreignField: "_id",
                        as: "senderDoc"
                    }
                },
                {
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "receiverId",
                        foreignField: "_id",
                        as: "receiverDoc"
                    }
                },
                {$unwind: {path: '$productDoc'}},
                {$unwind: {path: '$senderDoc'}},
                {$unwind: {path: '$receiverDoc'}},
                {
                    $group: {
                        _id: '$currencyId',
                        total: {$sum: '$amount'},
                        customerFee: {$sum: '$customerFee'},
                        discountFee: {$sum: '$discountFee'},
                        totalFee: {$sum: '$totalFee'},
                        agentFee: {$sum: '$agentFee'},
                        totalAmount: {$sum: '$totalAmount'},
                        totalUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$currencyId', "KHR"]

                                    },
                                    then: {$divide: ["$amount", exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "THB"]
                                            },
                                            then: {$divide: ["$amount", exchange.rates.THB]}
                                            , else: '$amount'
                                        }
                                    }
                                }
                            }
                        },
                        customerFeeUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$currencyId', "KHR"]

                                    },
                                    then: {$divide: ["$customerFee", exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "THB"]
                                            },
                                            then: {$divide: ["$customerFee", exchange.rates.THB]},
                                            else: '$customerFee'
                                        }
                                    }
                                }
                            }
                        },
                        totalFeeUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$currencyId', "KHR"]
                                    },
                                    then: {$divide: ["$totalFee", exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', "THB"]
                                            },
                                            then: {$divide: ["$totalFee", exchange.rates.THB]},
                                            else: '$totalFee'
                                        }
                                    }
                                }
                            }
                        },
                        agentFeeUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$currencyId', "KHR"]
                                    },
                                    then: {$divide: ["$agentFee", exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', "THB"]
                                            },
                                            then: {$divide: ["$agentFee", exchange.rates.THB]},
                                            else: '$agentFee'
                                        }
                                    }
                                }
                            }
                        },
                        totalAmountUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ['$currencyId', "KHR"]
                                    },
                                    then: {$divide: ["$totalAmount", exchange.rates.KHR]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "THB"]
                                            },
                                            then: {$divide: ["$totalAmount", exchange.rates.THB]},
                                            else: '$totalAmount'
                                        }
                                    }
                                }
                            }
                        },
                        discountFeeSum: {
                            $sum: '$discountFee'
                        },
                        products: {
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
                        total: {$sum: '$totalUSD'},
                        customerFee: {$sum: '$customerFeeUSD'},
                        discountFee: {$sum: '$discountFeeSum'},
                        agentFee: {$sum: '$agentFeeUSD'},
                        totalFee: {$sum: '$totalFeeUSD'},
                        totalAmount: {$sum: '$totalAmountUSD'}
                    }
                }
            ]);
            if (transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.total = transfers[0].total;
                data.footer.customerFee = transfers[0].customerFee;
                data.footer.discountFee = transfers[0].discountFee;
                data.footer.agentFee = transfers[0].agentFee;
                data.footer.totalFee = transfers[0].totalFee;
                data.footer.totalAmount = transfers[0].totalAmount;
            }
            return data
        }
    }
});
