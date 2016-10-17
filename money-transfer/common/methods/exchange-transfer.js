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
                    _id: obj._id,
                    convertTo: obj.convertTo,
                    selling: obj.selling
                });
            });
            return tmpExchangeTransfer;
        } else {
            return false;
        }
    }
});