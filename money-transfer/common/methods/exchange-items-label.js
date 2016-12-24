import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeStock} from '../collections/exchange-stock';
Meteor.methods({
    exchangeItemsLabel: function (baseCurrency, convertTo, toAmount) {
        let exchangeStock = ExchangeStock.findOne({baseCurrency: baseCurrency, convertTo: convertTo},
            {sort: {_id: 1}}
        );
        let exchangeCurrencyRateBuying = {};
        let exchangeCurrencyRate = {};
        if (exchangeStock) {
            // let buyingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).buying;
            // let sellingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).selling;
            if (baseCurrency && convertTo) {
                if (baseCurrency == 'KHR') {
                    if (convertTo == 'USD') {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
                    } else {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
                    }
                } else if (baseCurrency == 'USD') {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
                    } else {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
                    }
                } else if (baseCurrency == 'THB') {
                    if (convertTo == 'KHR') {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
                    } else if (convertTo == 'USD') {
                        exchangeCurrencyRateBuying = exchangeStock.buying;
                        exchangeCurrencyRate = exchangeStock.selling;
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
// import BigNumber from 'bignumber.js';
// BigNumber.config({ERRORS: false});
//
// import {ExchangeStock} from '../collections/exchange-stock';
// Meteor.methods({
//     exchangeItemsLabel: function (baseCurrency, convertTo) {
//         let exchangeStock = ExchangeStock.findOne({baseCurrency: baseCurrency, convertTo: convertTo},
//             {sort: {_id: 1}}
//         );
//         let exchangeCurrencyRateBuying = {};
//         let exchangeCurrencyRate = {};
//         if (exchangeStock) {
//             // let buyingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).buying;
//             // let sellingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).selling;
//             if (baseCurrency && convertTo) {
//                 if (baseCurrency == 'KHR') {
//                     if (convertTo == 'USD') {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     } else {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     }
//                 } else if (baseCurrency == 'USD') {
//                     if (convertTo == 'KHR') {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     } else {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     }
//                 } else if (baseCurrency == 'THB') {
//                     if (convertTo == 'KHR') {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     } else if (convertTo == 'USD') {
//                         exchangeCurrencyRateBuying = exchangeStock.buying;
//                         exchangeCurrencyRate = exchangeStock.selling;
//                     }
//                 }
//                 return {exBuyingRate: exchangeCurrencyRateBuying, exSellingRate: exchangeCurrencyRate};
//             } else {
//                 throw new Meteor.Error("Don't have any exchange Rate.");
//             }
//         } else {
//             return false;
//         }
//     }
// });
