import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {Transfer} from '../../collections/transfer';

export const transferBalanceOutstandingReport = new ValidatedMethod({
    name: 'moneyTransfer.transferBalanceOutstandingReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let data = {
                title: {},
                header: {},
                content: [{index: 'No Result'}],
                //footer: {}
            };

            // let date = _.trim(_.words(params.date, /[^To]+/g));
            let branch = params.branch;
            let product = params.product;
            let dateOs = params.repDate;
            let dateAs = moment(dateOs).add(1, 'days').toDate();
            /****** Title *****/
            data.title = Company.findOne();

            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let content = [];
            let selector = {};
            selector.transferDate = {
                $lt: dateAs
            };

            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            if (!_.isEmpty(product)) {
                selector.productId = {$in: product};
            }
            let transfers = Transfer.aggregate([
                {
                    $match: selector
                },
                // {
                //     $group: {
                //         _id: {productId: "$productId", currencyId: "$currencyId"},
                //         data: {
                //             $last: "$$ROOT"
                //         }
                //     }
                // },
                // {
                //     $group: {
                //         _id: '$_id.productId',
                //         currencyData: {
                //             $addToSet: '$data'
                //         }
                //     }
                // },
                // // {
                // //     $group: {
                // //         _id: '$productId',
                // //         currencyData:{
                // //             $addToSet: {
                // //                 _id: {
                // //                     $concat: ["$_id.productId", "-", "$_id.currencyId"]
                // //                 },
                // //                 data: {
                // //                     balanceAmount: '$data.balanceA'
                // //                 }
                // //             }
                // //         }
                // //     }
                // // },
                // // {
                // //     $project: {
                // //         _id: {
                // //             $concat: ["$_id.productId", "-", "$_id.currencyId"]
                // //         },
                // //         data: 1
                // //     }
                // // },
                // {
                //     $lookup: {
                //         from: "moneyTransfer_product",
                //         localField: "productId",
                //         foreignField: "_id",
                //         as: "productDoc"
                //     }
                // },
                // {$unwind: {path: '$productDoc'}},
                // {
                //     $project: {
                //         productId: 1,
                //         amount: 1,
                //         balanceAmount: 1,
                //         currencyId: 1,
                //         transferDate: 1,
                //         type: 1,
                //         accountId: 1,
                //         productDoc: 1
                //     },
                // },
                // {$sort: {_id: -1}},
                // {
                //     $group: {
                //         _id: null,
                //         data: {
                //             $addToSet: '$$ROOT'
                //         }
                //     }
                // }
                {
                    $project: {
                        productId: 1,
                        amount: 1,
                        balanceAmount: 1,
                        currencyId: 1,
                        transferDate: 1,
                        type: 1,
                        accountId: 1,
                        productDoc: 1
                    },
                },
                {
                    $group: {
                        _id: { productId: "$productId", currencyId: "$currencyId" },
                        data: {
                            $last: "$$ROOT"
                        }
                    }
                },

                {
                    $group: {
                        _id: '$_id.productId',
                        currencyData: {
                            $addToSet: '$data'
                        }
                    }
                },
                {
                    $lookup: {
                        from: "moneyTransfer_product",
                        localField: "_id",
                        foreignField: "_id",
                        as: "productDoc"
                    }
                },
                { $unwind: { path: '$productDoc' } },
                // {
                //     $project: {
                //         _id: {
                //             $concat: ["$_id.productId", "-", "$_id.currencyId"]
                //         },
                //         data: 1
                //     }
                // },
                // {$sort: {_id: -1}},
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: '$$ROOT'
                        }
                    }
                }

            ]);
            if (transfers.length > 0) {
                data.content = transfers[0].data;
            }
            //console.log(data);
            return data
        }
    }
});
