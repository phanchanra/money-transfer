;import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {ExchangeStock} from '../collections/exchange-stock';
Meteor.methods({
    calculateExchangeRateSelling: function (baseCurrency, convertTo, baseAmount) {
        let exchangeStock = ExchangeStock.findOne({
            baseCurrency: baseCurrency,
            convertTo: convertTo,
            balanceVariety: {$gt: 0}
        }, {sort: {_id: 1}});
        if (exchangeStock) {
            let sellingRate = exchangeStock.selling;
            let buyingRate = exchangeStock.buying;

            // let getExBalanceStock = [];
            // if (exchangeStock && exchangeStock.balanceStock) {
            //     getExBalanceStock = _.filter(exchangeStock.balanceStock, function (c) {
            //         return c.baseCurrency == baseCurrency
            //     });
            //     //let balanceStockEx = getExBalanceStock.find(x=>x.convertTo === convertTo).selling;
            //     let sellingRate = getExBalanceStock.find(x=>x.convertTo === convertTo).selling;
            //     let buyingRate = getExBalanceStock.find(x=>x.convertTo === convertTo).buying;
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
// import BigNumber from 'bignumber.js';
// BigNumber.config({ERRORS: false});
//
// import {ExchangeRate} from '../collections/exchange-rate';
// Meteor.methods({
//     calculateExchangeRateSelling: function (baseCurrency, convertTo, baseAmount) {
//         let exchangeRate = ExchangeRate.findOne({}, {sort: {_id: -1}});
//         if (exchangeRate) {
//             let getConvertCurrency = [];
//             if (exchangeRate && exchangeRate.convertCurrency) {
//                 getConvertCurrency = _.filter(exchangeRate.convertCurrency, function (c) {
//                     return c.baseCurrency == baseCurrency
//                 });
//                 let sellingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).selling;
//                 let buyingRate = getConvertCurrency.find(x=>x.convertTo === convertTo).buying;
//                 if (baseCurrency && convertTo && baseAmount) {
//                     let convertAmount = {};
//                     let convertAmountBuying = {};
//                     if (baseCurrency == 'KHR') {
//                         if (convertTo == 'USD') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
//                         } else if (convertTo == 'THB') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
//                         }
//                     } else if (baseCurrency == 'USD') {
//                         if (convertTo == 'KHR') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
//                         } else if (convertTo == 'THB') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
//                         }
//                     } else {
//                         if (convertTo == 'KHR') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(sellingRate)).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(buyingRate)).toFixed(2);
//                         } else if (convertTo == 'USD') {
//                             convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(sellingRate))).toFixed(2);
//                             convertAmountBuying = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(buyingRate))).toFixed(2);
//                         }
//                     }
//                     return {selling: convertAmount, buying: convertAmountBuying};
//                 } else {
//                     throw new Meteor.Error("Don't have any exchange Rate.");
//                 }
//             }
//         } else {
//             return false;
//         }
//     }
// });