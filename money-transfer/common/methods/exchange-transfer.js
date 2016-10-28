import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeRate} from '../collections/exchange-rate';
Meteor.methods({
    exchangeTransfer (currencyId) {
        let exchangeRate = ExchangeRate.findOne(
            {baseCurrency: currencyId},
            {sort: {_id: -1}}
        );
        var tmpExchangeTransfer = [];
        if (exchangeRate) {
            exchangeRate.convertCurrency.forEach(function (obj) {
                tmpExchangeTransfer.push({
                    convertTo: obj.convertTo,
                    selling: obj.selling
                });
            });
            //console.log({exchange: exchangeRate._id, exchangeTransfer:tmpExchangeTransfer});
            return {exchangeId: exchangeRate._id, exchangeTransfer:tmpExchangeTransfer};
        } else {
            return false;
        }
    }
});