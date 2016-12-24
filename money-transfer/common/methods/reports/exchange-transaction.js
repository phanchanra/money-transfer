import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company.js';
import {ExchangeTransaction} from '../../collections/exchange-transaction';
import {Exchange} from '../../../../core/common/collections/exchange'

export const exchangeTransactionReport = new ValidatedMethod({
    name: 'moneyTransfer.exchangeTransactionReport',
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
            let date = params.repDate;
            let fDate = moment(date[0]).toDate();
            let tDate = moment(date[1]).add(1, 'days').toDate();
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
            selector.exchangeDate = {
                $gte: fDate,
                $lte: tDate
            };
            if (!_.isEmpty(branch)) {
                selector.branchId = {$in: branch};
            }
            let exchangeTransaction = ExchangeTransaction.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {$unwind: {path: '$customerDoc'}},
                {
                    $project: {
                        exchangeDate: 1,
                        customerDoc: 1,
                        transferId:1
                    }
                },

                {
                    $group: {
                        _id: null,
                        data: {
                            $addToSet: "$$ROOT"
                        }
                    }
                }
            ]);

            if (exchangeTransaction.length > 0) {
                data.content = exchangeTransaction[0].data;
            }
            //console.log(data);
            return data;
        }
    }
});
