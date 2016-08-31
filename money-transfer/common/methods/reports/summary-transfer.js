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

export const summaryTransferReport = new ValidatedMethod({
    name: 'moneyTransfer.sumTransferReport',
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
            let transferType = params.transferType;
            let date = params.repDate;
            let fDate = moment(date[0]).toDate();
            let tDate = moment(date[1]).add(1, 'days').toDate();

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
            if (!_.isEmpty(transferType)) {
                selector.transferType = {$in: transferType};
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

            ]);
            if(transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.total = transfers[0].total;
            }
            return data
        }
    }
});
