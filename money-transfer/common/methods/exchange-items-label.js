import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeRate} from '../collections/exchange-rate';
Meteor.methods({
    exchangeItemsLabel: function (baseCurrency, convertTo) {
        let exchangeRate = ExchangeRate.findOne(
            {baseCurrency: baseCurrency, 'convertCurrency.convertTo': convertTo},
            {sort: {_id: -1}}
        );
        let exchangeCurrencyRateBuying = {};
        let exchangeCurrencyRate = {};
        if (exchangeRate) {
            let buyingRate = exchangeRate.convertCurrency.find(x=>x.convertTo === convertTo).buying;
            let sellingRate = exchangeRate.convertCurrency.find(x=>x.convertTo === convertTo).selling;
            if (baseCurrency && convertTo) {
                if (baseCurrency == 'KHR') {
                    if (convertTo == 'USD') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    } else if (convertTo == 'THB') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    }
                } else if (baseCurrency == 'USD') {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    } else if (convertTo == 'THB') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    }
                } else if (baseCurrency == 'THB') {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    } else if (convertTo == 'USD') {
                        exchangeCurrencyRateBuying = buyingRate;
                        exchangeCurrencyRate = sellingRate;
                    }
                }
                return {exBuyingRate: exchangeCurrencyRateBuying, exSellingRate: exchangeCurrencyRate};
            } else {
                throw new Meteor.Error("Don't have any exchange Rate.");
            }
        } else {
            return false;
        }
    }
});