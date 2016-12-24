import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
import {ExchangeStock} from '../../common/collections/exchange-stock';
import {exchangeState} from '../../common/libs/exchangeState';

ExchangeTransaction.before.insert(function (userId, doc) {
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(ExchangeTransaction, prefix, 12);
    exchangeState.set(tmpId, doc);
});

ExchangeTransaction.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        Meteor._sleepForMs(200);
        doc.items.forEach(function (obj) {
            let exchangeStock = ExchangeStock.find({
                baseCurrency: obj.baseCurrency,
                convertTo: obj.convertTo,
                balanceVariety: {$gt: 0}
            }, {sort: {_id: 1}}).fetch();
            let tmpBaseAmount = 0;
            let tmpBalance = 0;
            let overBalance = 0;
            let overBase = 0;
            for (let i = 0; i < exchangeStock.length; i++) {
                tmpBaseAmount = exchangeStock[i].baseAmount - (overBase == 0 ? obj.baseAmount : Math.abs(overBase));
                tmpBalance = exchangeStock[i].balanceVariety - (overBalance == 0 ? obj.toAmount : Math.abs(overBalance));
                //console.log('tmpBalance ' + tmpBalance)
                if (tmpBalance >= 0) {
                    let exStockId = exchangeStock[i]._id;
                    //console.log('inside balance > 0');
                    ExchangeStock.direct.update(
                        {_id: exStockId}, {
                            $set: {
                                status: "inactive",
                                baseAmount: tmpBaseAmount,
                                // balanceAmount: tmpBalance,
                                balanceVariety: tmpBalance
                            },
                            $inc: {
                                baseAmountSelling: overBase == 0 ? obj.baseAmount : Math.abs(overBase),
                                balanceSelling: overBalance == 0 ? obj.toAmount : Math.abs(overBalance)
                            }
                        }
                    );
                    break;
                } else {
                    let exStockId = exchangeStock[i]._id;
                    let currentExchangeStock = ExchangeStock.findOne({_id: exStockId});
                    overBalance = tmpBalance;
                    overBase = tmpBaseAmount;
                    ExchangeStock.direct.update(
                        {_id: exStockId}, {
                            $set: {
                                status: "inactive",
                                baseAmount: 0,
                                // balanceAmount: 0,
                                balanceVariety: 0
                            },
                            $inc: {
                                baseAmountSelling: currentExchangeStock.baseAmount,
                                balanceSelling: currentExchangeStock.balanceVariety
                            }
                        }
                    )
                }
            }
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
        Meteor._sleepForMs(200);
        let data = {};
        doc.items.forEach(function (item) {
            item.costs.forEach(function (cost) {
                // let exchangeStock = ExchangeStock.findOne({
                //     baseCurrency: cost.costBaseCurrency,
                //     convertTo: cost.costConvertTo,
                //     branchId: doc.branchId
                // }, {sort: {_id: -1}});
                //let balanceAmount = cost.costConvertSell + exchangeStock.balanceAmount;
                data.stockDate = moment().toDate();
                data.status = "active";
                data.exchangeId = cost.costExchangeId;
                data.baseCurrency = cost.costBaseCurrency;
                data.convertTo = cost.costConvertTo;
                data.originalBaseAmount = cost.costBaseAmountBuying;
                data.baseAmount = cost.costBaseAmountBuying;
                data.balanceSelling = 0;
                data.buying = cost.costBuyRate;
                data.selling = cost.costSellRate;
                data.amount = cost.costConvertSell;
                //data.balanceAmount = balanceAmount;
                data.baseVariety = cost.costConvertSell;
                data.baseAmountSelling = 0;
                data.branchId = doc.branchId;
                ExchangeStock.insert(data);
            });
        });
    });
});