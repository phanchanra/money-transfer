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
        //let prefix = doc.branchId + '-';
        let data = {};
        //let index = 1;
        doc.convertCurrency.forEach(function (obj) {
            // let exchangeStock = ExchangeStock.findOne({
            //     baseCurrency: obj.baseCurrency,
            //     convertTo: obj.convertTo
            // }, {sort: {_id: -1}});

            // if (exchangeStock) {
            //     index = exchangeStock.index + 1;
            // } else {
            //     index = 1;
            // }
            data.stockDate = doc.exchangeDate;
            data.status = "active";
            data.exchangeId = doc._id;
            data.baseCurrency = obj.baseCurrency;
            data.convertTo = obj.convertTo;
            data.originalBaseAmount = obj.amount;
            data.baseAmount = obj.amount;
            data.buying = obj.buying;
            data.selling = obj.selling;
            data.amount = obj.convertAmount;
            // if (exchangeStock) {
            //     data.balanceAmount = new BigNumber(exchangeStock.balanceAmount).add(new BigNumber(obj.convertAmount)).toFixed(2);
            // } else {
            //     data.balanceAmount = obj.convertAmount;
            // }
            data.balanceVariety = obj.convertAmount;
            data.balanceSelling = 0;
            data.branchId = doc.branchId;
            //data.index = index;
            ExchangeStock.insert(data);
        });
    });
});
ExchangeRate.after.update(function (userId, doc) {
    Meteor.defer(function () {
        let exchangeStockForUpdate = ExchangeStock.findOne({
            exchangeId: doc._id,
        }, {sort: {_id: -1}});
        let data = {};
        doc.convertCurrency.forEach(function (obj) {
            data.stockDate = doc.exchangeDate;
            data.exchangeId = doc._id;
            data.baseCurrency = obj.baseCurrency;
            data.convertTo = obj.convertTo;
            data.originalBaseAmount = obj.amount;
            data.baseAmount = obj.amount;
            data.buying = obj.buying;
            data.selling = obj.selling;
            data.amount = obj.convertAmount;
            data.balanceAmount = obj.convertAmount;
            data.index = exchangeStockForUpdate.index + 1;
            ExchangeStock.direct.update(
                exchangeStockForUpdate._id, {
                    $set: data
                }
            );
            // let exchangeStockForUpdate = ExchangeStock.findOne({
            //     baseCurrency: doc.baseCurrency,
            //     convertTo: obj.convertTo,
            // }, {sort: {_id: -1}});
            //
            // let previousExchangeStock = ExchangeStock.findOne({
            //     baseCurrency: doc.baseCurrency,
            //     convertTo: obj.convertTo,
            //     _id: {$ne: exchangeStockForUpdate._id}
            // }, {sort: {_id: -1}});
            // if (previousExchangeStock) {
            //     ExchangeStock.direct.update(
            //         exchangeStockForUpdate._id, {
            //             $set: {
            //                 baseCurrency: doc.baseCurrency,
            //                 convertTo: obj.convertTo,
            //                 exchangeDate: doc.exchangeDate,
            //                 amount: obj.convertAmount,
            //                 balanceAmount: new BigNumber(previousExchangeStock.balanceAmount).add(new BigNumber(obj.convertAmount)).toFixed(2)
            //             }
            //         }
            //     );
            // } else {
            // ExchangeStock.direct.update(
            //     exchangeStockForUpdate._id, {
            //         $set: {
            //             baseCurrency: doc.baseCurrency,
            //             convertTo: obj.convertTo,
            //             exchangeDate: doc.exchangeDate,
            //             amount: obj.convertAmount,
            //             balanceAmount: obj.convertAmount
            //         }
            //     }
            // );
            //}
        });

    });
});
ExchangeRate.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        // let exchangeStock = ExchangeStock.find({exchangeId:doc._id});
        // exchangeStock.forEach(function (obj) {
        ExchangeStock.remove({exchangeId: doc._id});
        // });
    });
});
