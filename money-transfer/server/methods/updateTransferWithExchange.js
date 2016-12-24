import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
Meteor.methods({
    updateTransferWithExchange: function (exchangeId) {
        if (exchangeId) {
            let ExchangeTran = ExchangeTransaction.findOne({_id: exchangeId});
            tmpExchange = [];
            ExchangeTran.items.forEach(function (obj) {
                tmpExchange.push({
                    convertTo: obj.convertTo,
                    baseAmount: obj.baseAmount,
                    toAmount: obj.toAmount
                })
            });
            return {tmpExchange: tmpExchange};
        }
    }
});