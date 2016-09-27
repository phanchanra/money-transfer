import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

// Collection
import {ExchangeRate} from '../../common/collections/exchange-rate';
import {ExchangeStock} from '../../common/collections/exchange-stock';

ExchangeRate.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    doc._id = idGenerator.gen(ExchangeRate, 12);
});

ExchangeRate.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let prefix = doc.branchId + '-';
        let data = {};
        doc.convertCurrency.forEach(function (obj) {
            let id = idGenerator.genWithPrefix(ExchangeStock, prefix, 12);
            let exchangeStock = ExchangeStock.findOne({
                baseCurrency: doc.baseCurrency,
                convertTo: obj.convertTo
            }, {sort: {_id: -1}});
            if (exchangeStock) {
                let balanceAmount = exchangeStock.balanceAmount;
                data._id = id;
                data.baseCurrency = doc.baseCurrency;
                data.convertTo = obj.convertTo;
                data.exchangeDate = doc.exchangeDate;
                data.status = "IN";
                data.amount = obj.convertAmount;
                data.balanceAmount = new BigNumber(obj.convertAmount).add(new BigNumber(balanceAmount)).toFixed(2);
                data.exchangeId = doc._id;
                data.branchId = doc.branchId;
            } else {
                data._id = id;
                data.baseCurrency = doc.baseCurrency;
                data.convertTo = obj.convertTo;
                data.exchangeDate = doc.exchangeDate;
                data.status = "IN";
                data.amount = obj.convertAmount;
                data.balanceAmount = obj.convertAmount;
                data.exchangeId = doc._id;
                data.branchId = doc.branchId;
            }
            ExchangeStock.insert(data);
        });
    });
});
ExchangeRate.after.update(function (userId, doc) {
    Meteor.defer(function () {
        doc.convertCurrency.forEach(function (obj) {
            let exchangeStockForUpdate = ExchangeStock.findOne({
                baseCurrency: doc.baseCurrency,
                convertTo: obj.convertTo,
            }, {sort: {_id: -1}});
            let previousExchangeStock = ExchangeStock.findOne({
                baseCurrency: doc.baseCurrency,
                convertTo: obj.convertTo,
                _id: {$ne: exchangeStockForUpdate._id}
            }, {sort: {_id: -1}});

            if (previousExchangeStock) {
                ExchangeStock.direct.update(
                    exchangeStockForUpdate._id, {
                        $set: {
                            baseCurrency: doc.baseCurrency,
                            convertTo: obj.convertTo,
                            exchangeDate: doc.exchangeDate,
                            amount: obj.convertAmount,
                            balanceAmount: new BigNumber(previousExchangeStock.balanceAmount).add(new BigNumber(obj.convertAmount)).toFixed(2)
                        }
                    }
                );
            } else {
                ExchangeStock.direct.update(
                    exchangeStockForUpdate._id, {
                        $set: {
                            baseCurrency: doc.baseCurrency,
                            convertTo: obj.convertTo,
                            exchangeDate: doc.exchangeDate,
                            amount: obj.convertAmount,
                            balanceAmount: obj.convertAmount
                        }
                    }
                );
            }
        });
    });
});
ExchangeRate.after.remove(function (userId, doc) {


    
});
