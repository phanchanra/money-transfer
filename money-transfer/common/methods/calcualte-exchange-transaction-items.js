import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeRate} from '../collections/exchange-rate';
Meteor.methods({
    calculateExchangeRateSelling: function (baseCurrency, convertTo, baseAmount) {
        let exchangeRate = ExchangeRate.findOne(
            {baseCurrency: baseCurrency, 'convertCurrency.convertTo': convertTo},
            {sort: {_id: -1}}
        );
        if (exchangeRate) {
            let sellingRate = exchangeRate.convertCurrency.find(x=>x.convertTo === convertTo).selling;
            let buyingRate = exchangeRate.convertCurrency.find(x=>x.convertTo === convertTo).buying;
            if (baseCurrency && convertTo && baseAmount) {
                let convertAmount = {};
                let convertAmountBuying = {};
                if (baseCurrency == 'KHR') {
                    if (convertTo == 'USD') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
                    } else if (convertTo == 'THB') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
                    }
                } else if (baseCurrency == 'USD') {
                    if (convertTo == 'KHR') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
                    } else if (convertTo == 'THB') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
                    }
                } else {
                    if (convertTo == 'KHR') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
                    } else if (convertTo == 'USD') {
                        convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
                        convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
                    }
                }
                return {selling: convertAmount, buying: convertAmountBuying};
            } else {
                throw new Meteor.Error("Don't have any exchange Rate.");
            }
        } else {
            return false;
        }
    }
});