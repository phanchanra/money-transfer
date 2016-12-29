import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {ExchangeStock} from '../../collections/exchange-stock';
import {Exchange} from '../../../../core/common/collections/exchange'

export const exchangeStockInReport = new ValidatedMethod({
    name: 'moneyTransfer.exchangeStockInReport',
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

            // let dateFrom = moment(params.repDate[0]).startOf('day').toDate();
            // let dateTo = moment(params.repDate[1]).endOf('day').toDate();

            // let exchange = Exchange.findOne(params.exchange);
            // params.exchangeObj = moment(exchange.exDate).format('DD/MM/YYYY') + ' ' + exchange.base + '  ' + exchange.rates.USD + '=' + exchange.rates.KHR + 'KHR' + ' | ' + exchange.rates.THB + 'THB';

            /****** Title *****/
            data.title = Company.findOne();
            /****** Header *****/
            data.header = params;

            /****** Content *****/
            let selector = {};
            selector.stockDate = {
                $gte: fDate,
                $lte: tDate
            };
            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            let exchangeStockIn = ExchangeStock.aggregate([
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
                {
                    $project: {
                        productDoc: 1,
                        stockDate: 1,
                        status:1,
                        baseCurrency:1,
                        convertTo:1,
                        originalBaseAmount:1,
                        baseSelling:1,
                        buying:1,
                        selling:1,
                        amount:1,

                    }
                },
                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: "$$ROOT"
                        },

                    }
                }
            ]);

            if (exchangeStockIn.length > 0) {
                data.content = exchangeStockIn[0].data;
                // data.footer.totalToAmount = exchangeStockIn[0].totalToAmount;
                // data.footer.totalIncome = exchangeStockIn[0].totalIncome;
            }
            //console.log(data);
            return data;
        }
    }
});
