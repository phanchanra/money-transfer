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

export const transferSummaryReport = new ValidatedMethod({
    name: 'moneyTransfer.transferSummaryReport',
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
            let transfers = Transfer.aggregate([
                {
                    $match: selector
                },
                {
                    //lookup for product
                    $lookup: {
                        from: "moneyTransfer_product",//collection name
                        localField: "productId", //via id
                        foreignField: "_id",//id product
                        as: "productDoc"//get doc
                    }
                },
                {$unwind: {path: '$productDoc'}},
                // {
                //     $project: {
                //         convertToFirst: 1,
                //         convertToSecond: 1
                //     },
                // },
                {
                    $group: {
                        _id: {
                            currencyId: "$currencyId",//group by currency
                            productId: "$productId"//group by productId
                        },

                        amount: {$sum: '$amount'},
                        customerFee: {$sum: '$customerFee'},
                        discountFee: {$sum: '$discountFee'},
                        totalFee: {$sum: '$totalFee'},
                        baseAmountFirst: {$sum: '$baseAmountFirst'},
                        baseAmountSecond: {$sum: '$baseAmountSecond'},
                        toAmountFirst: {$sum: '$toAmountFirst'},
                        toAmountSecond: {$sum: '$toAmountSecond'},
                        totalAmount: {$sum: '$totalAmount'},
                        productDoc: {$last: "$productDoc"},
                        convertToFirst:{$last:"$convertToFirst"},
                        convertToSecond:{$last:"$convertToSecond"},
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
                        totalAmountUSD: {
                            $sum: {
                                $cond: {//condition sum by currency and product
                                    if: {$eq: ["$currencyId", "THB"]},
                                    then: {$divide: ["$amount", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', 'KHR']
                                            },
                                            then: {$divide: ["$amount", exchange.rates.KHR]},
                                            else: "$amount"

                                        }
                                    }
                                }
                            }
                        },
                        totalCustomerFeeUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$currencyId", "THB"],
                                    },
                                    then: {$divide: ["$customerFee", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "KHR"]
                                            },
                                            then: {$divide: ["$customerFee", exchange.rates.KHR]},
                                            else: "$customerFee"
                                        }
                                    }
                                }
                            }
                        },
                        totalTotalFeeUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$currencyId", "THB"],
                                    },
                                    then: {$divide: ["$totalFee", exchange.rates.THB]},
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "KHR"]
                                            },
                                            then: {$divide: ["$totalFee", exchange.rates.KHR]},
                                            else: "$totalFee"
                                        }
                                    }
                                }
                            }
                        },
                        totalDiscountFee: {
                            $sum: 'discountFee'
                        },
                        totalTotalAmountUSD: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $eq: ["$currencyId", "THB"]
                                    },
                                    then: {$divide: ["$totalAmount", exchange.rates.THB]},

                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ["$currencyId", "KHR"]
                                            },
                                            then: {$divide: ["$totalAmount", exchange.rates.KHR]},
                                            else: "$totalAmount"
                                        }
                                    }

                                }
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$_id.currencyId',//group by currency for sum
                        data: {
                            $addToSet: {
                                productDoc: '$productDoc',//add to array
                                amount: '$amount',//
                                customerFee: '$customerFee',
                                discountFee: '$discountFee',
                                totalFee: '$totalFee',
                                baseAmountFirst: '$baseAmountFirst',
                                baseAmountSecond: '$baseAmountSecond',
                                convertToFirst: '$convertToFirst',
                                convertToSecond: '$convertToSecond',
                                toAmountFirst: '$toAmountFirst',
                                toAmountSecond: '$toAmountSecond',
                                totalAmount: '$totalAmount'
                            }
                        },
                        totalAmount: {$sum: '$totalAmountUSD'},
                        totalCustomerFee: {$sum: '$totalCustomerFeeUSD'},
                        totalDiscountFee: {$sum: '$totalDiscountFee'},
                        totalTotalFee: {$sum: '$totalTotalFeeUSD'},
                        totalBaseAmountFirst: {$sum: '$totalBaseAmountFirstUSD'},
                        totalBaseAmountSecond: {$sum: '$totalBaseAmountSecondUSD'},
                        totalToAmountFirst: {$sum: '$totalToAmountFirstUSD'},
                        totalToAmountSecond: {$sum: '$totalToAmountSecondUSD'},
                        totalTotalAmount: {$sum: '$totalTotalAmountUSD'}
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {$addToSet: "$$ROOT"},
                        total: {$sum: "$totalAmount"},
                        totalCustomerFee: {$sum: "$totalCustomerFee"},
                        totalDiscountFee: {$sum: "$totalDiscountFee"},
                        totalTotalFee: {$sum: '$totalTotalFee'},
                        totalBaseAmountFirst: {$sum: '$totalBaseAmountFirst'},
                        totalBaseAmountSecond: {$sum: '$totalBaseAmountSecond'},
                        totalToAmountFirst: {$sum: '$totalToAmountFirst'},
                        totalToAmountSecond: {$sum: '$totalToAmountSecond'},
                        totalTotalAmount: {$sum: '$totalTotalAmount'}
                    }
                }

            ]);
            if (transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.total = transfers[0].total;
                data.footer.totalCustomerFee = transfers[0].totalCustomerFee;
                data.footer.totalDiscountFee = transfers[0].totalDiscountFee;
                data.footer.totalTotalFee = transfers[0].totalTotalFee;
                data.footer.totalBaseAmountFirst = transfers[0].totalBaseAmountFirst;
                data.footer.totalBaseAmountSecond = transfers[0].totalBaseAmountSecond;
                data.footer.totalToAmountFirst = transfers[0].totalToAmountFirst;
                data.footer.totalToAmountSecond = transfers[0].totalToAmountSecond;
                data.footer.totalTotalAmount = transfers[0].totalTotalAmount;
            }
            console.log(data);
            return data
        }
    }
});
