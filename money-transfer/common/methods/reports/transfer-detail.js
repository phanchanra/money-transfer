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

export const transferDetailReport = new ValidatedMethod({
    name: 'moneyTransfer.transferDetailReport',
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
                { $unwind: { path: '$productDoc' } },
                {
                    $project: {
                        currencyId: 1,
                        productId: 1,
                        productDoc: 1,
                        transferDate: 1,
                        type:1,
                        amount:1,
                        sumProduct: {
                            $sum: {
                                $cond: {//condition sum by currency and product
                                    if: { $eq: ["$currencyId", "THB"] },
                                    then: { $divide: ["$amount", exchange.rates.THB] },
                                    else: {
                                        $cond: {
                                            if: {
                                                $eq: ['$currencyId', 'KHR']
                                            },
                                            then: { $divide: ["$amount", exchange.rates.KHR] },
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
                        _id: null,
                        data: {
                            $addToSet: "$$ROOT"
                        },
                        total: {
                            $sum: "$sumProduct"
                        }
                    }
                }
            ]);
            if(transfers.length > 0) {
                data.content = transfers[0].data;
                data.footer.total = transfers[0].total;
            }
            console.log(data);
            return data
        }
    }
});
