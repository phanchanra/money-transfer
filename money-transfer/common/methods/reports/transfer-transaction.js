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
            // let selector = {
            //     orderDate: {
            //         $gte: moment().subtract(6, 'days').startOf('day').toDate(),
            //         $lte: moment().endOf('day').toDate()
            //     }
            // };
            // let date = _.trim(_.words(params.date, /[^To]+/g));
            let branch = params.branch;
            let product = params.product;
            let type = params.type;
            //let date = params.repDate;
            // let fDate = moment(params.repDate[0]).toDate();
            // let tDate = moment(params.repDate[1]).add(1, 'days').toDate();
            let fDate = moment(params.repDate[0], "DD/MM/YYYY").startOf('day').toDate(); // set to 12:00 am today
            let tDate = moment(params.repDate[1], "DD/MM/YYYY").endOf('day').toDate(); // set to 23:59 pm today
            let exchangeId = params.exchange;
            let exchange = Exchange.findOne(exchangeId);
            params.exchangeObj = moment(exchange.exDate).format('DD/MM/YYYY') + ' ' + exchange.base + '  ' + exchange.rates.USD + '=' + exchange.rates.KHR + 'KHR' + ' | ' + exchange.rates.THB + 'THB';

            /****** Title *****/
            data.title = Company.findOne();
            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let content = [];
            let selector = {};
            selector.transferDate = {$gte: fDate, $lte: tDate};

            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            if (!_.isEmpty(product)) {
                selector.productId = {$in: product};
            }
            if (!_.isEmpty(type)) {
                selector.type = {$in: type};
            }
            //console.log(selector);
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
                {
                    $lookup: {
                        from: "currencyExchange_ExchangeTransaction",
                        localField: "exchangeId",
                        foreignField: "_id",
                        as: "exDoc"
                    }
                },
                {$unwind: {path: '$productDoc', preserveNullAndEmptyArrays:true}},
                {$unwind: {path: '$senderDoc', preserveNullAndEmptyArrays:true}},
                {$unwind: {path: '$receiverDoc',preserveNullAndEmptyArrays:true}},
                {$unwind: {path: '$exDoc', preserveNullAndEmptyArrays:true}},
                {
                    $group: {
                        _id: '$currencyId',
                        total: {$sum: '$amount'},
                        customerFee: {$sum: '$customerFee'},
                        discountFee: {$sum: '$discountFee'},
                        totalFee: {$sum: '$totalFee'},
                        agentFee: {$sum: '$agentFee'},
                        totalAmount: {$sum: '$totalAmount'},
                        baseAmountFirst: {$sum: '$exDoc.items[0].baseAmount'},
                        baseAmountSecond: {$sum: '$exDoc.items[1].baseAmount'},
                        toAmountFirst: {$sum: '$exDoc.items[0].toAmount'},
                        toAmountSecond: {$sum: '$exDoc.items[1].toAmount'},
                        // baseAmountFirst: {$sum: '$baseAmountFirst'},
                        // baseAmountSecond: {$sum: '$baseAmountSecond'},
                        // toAmountFirst: {$sum: '$toAmountFirst'},
                        // toAmountSecond: {$sum: '$toAmountSecond'},
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
                        //
                        //convert money
                        totalBaseAmountFirstUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$currencyId", "THB"]},
                                    then: {$divide: ["$baseAmountFirst", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', 'KHR']
                                            },
                                            then: {$divide: ['$baseAmountFirst', exchange.rates.KHR]},
                                            else: "$baseAmountFirst"
                                        }
                                    }
                                }
                            }
                        },
                        totalBaseAmountSecondUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$currencyId", "THB"]},
                                    then: {$divide: ["$baseAmountSecond", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', 'KHR']
                                            },
                                            then: {$divide: ['$baseAmountSecond', exchange.rates.KHR]},
                                            else: "$baseAmountSecond"
                                        }
                                    }
                                }
                            }
                        },
                        totalToAmountFirstUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$convertToFirst", "THB"]},
                                    then: {$divide: ["$toAmountFirst", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$convertToFirst', 'KHR']
                                            },
                                            then: {$divide: ['$toAmountFirst', exchange.rates.KHR]},
                                            else: "$toAmountFirst"
                                        }
                                    }
                                }
                            }
                        },
                        totalToAmountSecondUSD: {
                            $sum: {
                                $cond: {
                                    if: {$eq: ["$convertToSecond", "THB"]},
                                    then: {$divide: ["$toAmountSecond", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$convertToSecond', 'KHR']
                                            },
                                            then: {$divide: ['$toAmountSecond', exchange.rates.KHR]},
                                            else: "$toAmountSecond"
                                        }
                                    }
                                }
                            }
                        },
                        //
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
                        // discountFeeSum: {
                        //     $sum: '$discountFee'
                        // },
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

                        agentFee: {$sum: '$agentFeeUSD'},
                        totalFee: {$sum: '$totalFeeUSD'},
                        totalAmount: {$sum: '$totalAmountUSD'},
                        totalBaseAmountFirst: {$sum: '$totalBaseAmountFirstUSD'},
                        totalBaseAmountSecond: {$sum: '$totalBaseAmountSecondUSD'},
                        totalToAmountFirst: {$sum: '$totalToAmountFirstUSD'},
                        totalToAmountSecond: {$sum: '$totalToAmountSecondUSD'},
                    }
                }
            ]);
            if (transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.total = transfers[0].total;
                data.footer.customerFee = transfers[0].customerFee;
                // data.footer.discountFee = transfers[0].discountFee;
                data.footer.agentFee = transfers[0].agentFee;
                data.footer.totalFee = transfers[0].totalFee;
                //
                data.footer.totalBaseAmountFirst = transfers[0].totalBaseAmountFirst;
                data.footer.totalBaseAmountSecond = transfers[0].totalBaseAmountSecond;
                data.footer.totalToAmountFirst = transfers[0].totalToAmountFirst;
                data.footer.totalToAmountSecond = transfers[0].totalToAmountSecond;

                data.footer.totalAmount = transfers[0].totalAmount;
            }
            return data
        }
    }
});
