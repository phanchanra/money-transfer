import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeRate} from '../collections/exchange-rate';
Meteor.methods({
    exchangeItemsLabel: function (baseCurrency, convertTo) {
        let exchangeRate = ExchangeRate.findOne(
            {baseCurrency: baseCurrency, 'convertCurrency.convertTo': convertTo},
            {sort: {_id: -1}}
        );
        let exchangeCurrencyRate ={};

        if (exchangeRate) {
            let sellingRate = exchangeRate.convertCurrency.find(x=>x.convertTo === convertTo).selling;
            if (baseCurrency && convertTo) {
                if (baseCurrency == 'KHR') {
                    if (convertTo == 'USD') {
                        exchangeCurrencyRate = new BigNumber(1).div(new BigNumber(sellingRate));
                    } else if (convertTo == 'THB') {
                        exchangeCurrencyRate = new BigNumber(1).div(new BigNumber(sellingRate));
                    }
                } else if (baseCurrency == 'USD') {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRate = sellingRate;
                    } else if (convertTo == 'THB') {
                        exchangeCurrencyRate = sellingRate;
                    }
                } else  {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRate = sellingRate;
                    } else if (convertTo == 'USD') {
                        exchangeCurrencyRate = new BigNumber(1).div(new BigNumber(sellingRate));
                    }
                }
                return exchangeCurrencyRate;
            } else {
                throw new Meteor.Error("Don't have any exchange Rate.");
            }
        } else {
            return false;
        }
    }
});