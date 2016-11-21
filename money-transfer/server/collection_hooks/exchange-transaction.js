import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
import {ExchangeStock} from '../../common/collections/exchange-stock';
import {exchangeState} from '../../common/libs/exchangeState';

ExchangeTransaction.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(ExchangeTransaction, prefix, 12);
    exchangeState.set(tmpId, doc);
    // doc.items.forEach(function (o) {
    //     console.log(o);
    //     //doc.income = new BigNumber(o.toAmount).minus(new BigNumber(o.toAmountBuying)).toFixed(2);
    // });
});
ExchangeTransaction.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let prefix = doc.branchId + '-';
        let data = {};
        doc.items.forEach(function (obj) {
            let id = idGenerator.genWithPrefix(ExchangeStock, prefix, 12);
            let exchangeStock = ExchangeStock.findOne({
                baseCurrency: obj.baseCurrency,
                convertTo: obj.convertTo
            }, {sort: {_id: -1}});
            if (exchangeStock) {
                data._id = id;
                data.baseCurrency = obj.baseCurrency;
                data.convertTo = obj.convertTo;
                data.exchangeDate = doc.exchangeDate;
                data.status = "OUT";
                data.amount = obj.toAmount;
                data.balanceAmount = new BigNumber(exchangeStock.balanceAmount).minus(new BigNumber(obj.toAmount)).toFixed(2);
                data.exchangeId = doc._id;
                data.branchId = doc.branchId;
            } else {
                data._id = id;
                data.baseCurrency = doc.baseCurrency;
                data.convertTo = obj.convertTo;
                data.exchangeDate = doc.exchangeDate;
                data.status = "OUT";
                data.amount = obj.toAmount;
                data.balanceAmount = obj.toAmount;
                data.exchangeId = doc._id;
                data.branchId = doc.branchId;
            }
            ExchangeStock.insert(data);
        });
    });
});
//
ExchangeTransaction.after.update(function (userId, doc) {
    Meteor.defer(function () {
        doc.items.forEach(function (obj) {
            let exchangeStockForUpdate = ExchangeStock.findOne({
                baseCurrency: obj.baseCurrency,
                convertTo: obj.convertTo,
            }, {sort: {_id: -1}});

            let previousExchangeStock = ExchangeStock.findOne({
                baseCurrency: obj.baseCurrency,
                convertTo: obj.convertTo,
                _id: {$ne: exchangeStockForUpdate._id}
            }, {sort: {_id: -1}});

            if (previousExchangeStock) {
                ExchangeStock.direct.update(
                    exchangeStockForUpdate._id, {
                        $set: {
                            baseCurrency: obj.baseCurrency,
                            convertTo: obj.convertTo,
                            exchangeDate: doc.exchangeDate,
                            amount: obj.baseAmount,
                            balanceAmount: new BigNumber(previousExchangeStock.balanceAmount).minus(new BigNumber(obj.toAmount)).toFixed(2)
                        }
                    }
                );
            } else {
                ExchangeStock.direct.update(
                    exchangeStockForUpdate._id, {
                        $set: {
                            baseCurrency: obj.baseCurrency,
                            convertTo: obj.convertTo,
                            exchangeDate: doc.exchangeDate,
                            amount: obj.baseAmount,
                            balanceAmount: -obj.toAmount
                        }
                    }
                );
            }
        });
    });
});

ExchangeTransaction.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        doc.items.forEach(function (obj) {
            let exchangeStock = ExchangeStock.findOne({
                baseCurrency: obj.baseCurrency,
                convertTo: obj.convertTo
            }, {sort: {_id: -1}});
            if (exchangeStock)
                ExchangeStock.remove({exchangeId: doc.exchangeId});
        });
    });
});