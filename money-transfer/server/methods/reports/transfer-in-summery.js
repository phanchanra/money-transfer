import {Transfer} from '../../../imports/api/collections/transfer';
Meteor.methods({
    summeryTransferIn: function (dateFrom, dateTo, product, branch) {
        dateFrom = moment(dateFrom).toDate();
        dateTo = moment(dateTo).toDate();
        Transfer.aggregate([
            {
                $match: {
                    transferType: "In",
                    transferDate: {
                        $gte: dateFrom, $lte: dateTo
                    },
                    productId: product,
                    branchId: branch

                }
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
            {
                $group: {
                    _id: {
                        currencyId: "$currencyId",//group by currency
                        productId: "$productId"//group by productId
                    },

                    originCustomerFee: {$sum: '$customerFee'},
                    origintotalFee: {$sum: '$totalFee'},
                    originAmount: {$sum: '$amount'},
                    productDoc: {$last: "$productDoc"},
                    sumProduct: {
                        $sum: {
                            $cond: {//condition sum by currency and product
                                if: {$eq: ["$currencyId", "THB"]},
                                then: {$divide: ["$amount", 4000]},
                                else: {
                                    $cond: {
                                        if: {
                                            $eq: ['$currencyId', 'KHR']
                                        },
                                        then: {$divide: ["$amount", 4000]},
                                        else: "$amount"

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
                            sumProduct: '$sumProduct'//
                        }
                    },
                    totalSumProduct: {$sum: '$sumProduct'}
                }
            },
            {
                $group: {
                    _id: null,
                    data: {
                        $addToSet: "$$ROOT"
                    },
                    total: {
                        $sum: "$totalSumProduct"
                    }
                }
            }

        ])
    }
});