import {ExchangeStock} from '../../common/collections/exchange-stock';
Meteor.methods({
    checkStockBeforeExchange(baseCurrency, convertTo) {
        let exchangeStockBeforeExchange = ExchangeStock.find({
            baseCurrency: baseCurrency,
            convertTo: convertTo,
            baseAmount: {$gt: 0}
        });
        let tmpBalance = 0;
        if (exchangeStockBeforeExchange.count() > 0) {
            exchangeStockBeforeExchange.forEach(function (obj) {
                tmpBalance += obj.baseAmount;
            });
        }
        //console.log("check amount" + tmpBalance - amount);
        return tmpBalance;
        // console.log(amount);
        // console.log(tmpBalance);
        //return {amount: tmpBalance - amount};
    }
});