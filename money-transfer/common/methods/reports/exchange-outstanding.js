import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {ExchangeStock} from '../../collections/exchange-stock';

export const ExchangeOutstandingReport = new ValidatedMethod({
    name: 'moneyTransfer.ExchangeOutstandingReport',
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
            let branch = params.branch;
            let dateOs = params.repDate;
            let dateAs = moment(dateOs).add(1, 'days').toDate();
            /****** Title *****/
            data.title = Company.findOne();

            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let content = [];
            let selector = {};
            selector.stockDate = {
                $lt: dateAs
            };
            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            let exchangeOutstanding = ExchangeStock.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "currencyExchange_ExchangeRate",
                        localField: "exchangeId",
                        foreignField: "_id",
                        as: "exchangeDoc"
                    }
                },
                { $unwind: { path: '$exchangeDoc', preserveNullAndEmptyArrays:true } },
                {   $lookup: {
                    from: "currencyExchange_provider",
                    localField: "exchangeDoc.providerId",
                    foreignField: "_id",
                    as: "providerDoc"
                }
                },
                { $unwind: {path:'$providerDoc', preserveNullAndEmptyArrays:true}},

                {
                    $group: {
                        _id: { baseCurrency: "$baseCurrency", convertTo: "$convertTo" },
                        baseAmount: {$sum: '$baseAmount'},
                        balanceVariety:{$sum:'$balanceVariety'},
                        data: {
                            $last: "$$ROOT"
                        }
                    }
                },
                {
                    $project: {
                        _id: {$concat: ["$_id.baseCurrency", '-', "$_id.convertTo"]},
                        baseAmount: 1,
                        balanceVariety: 1,
                        data: 1
                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: '$$ROOT'
                        }
                    }
                }

            ]);
            if (exchangeOutstanding.length > 0) {
                data.content = exchangeOutstanding[0].data;
            }
            return data;
        }
    }
});
