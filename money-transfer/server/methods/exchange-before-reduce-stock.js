import {ExchangeStock} from '../../common/collections/exchange-stock';
Meteor.methods({
    exchangeBeforeReduceStock: function (baseCurrency, convertTo, amountSelling) {
        // exchangeBeforeReduceStock: function (baseCurrency, convertTo, baseAmount, amountBuying, amountSelling) {
        let exchangeStock = ExchangeStock.find({
            baseCurrency: baseCurrency,
            convertTo: convertTo,
            balanceVariety: {$gt: 0}
        }, {sort: {_id: 1}}).fetch();
        let enoughAmount = amountSelling;
        let totalBuying = 0;
        let totalSelling = 0;
        let netIncome = 0;
        let tempEx = [];
        let amountBuyingConvert = 0;
        let amountSellingConvert = 0;
        let income = 0;
        let totalBaseAmount = 0;
        for (let i = 0; i < exchangeStock.length; i++) {
            if (baseCurrency == "THB") {
                if (convertTo == "USD") {
                    //THB->USD
                    let baseDeduct = 0;
                    let exchangeId = '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount / exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount / exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            baseDeduct = exchangeStock[i].baseAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalBuying - totalSelling, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            costExchangeId: exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }
                } else if (convertTo == "KHR") {
                    //THB->KHR
                    let baseDeduct = 0;
                    let exchangeId = '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount * exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount * exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            baseDeduct = exchangeStock[i].baseAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalSelling - totalBuying, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            costExchangeId: exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }
                }
            } else if (baseCurrency == "USD") {
                if (convertTo == "KHR") {
                    //USD->KHR
                    let baseDeduct = 0;
                    let exchangeId = '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount * exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount * exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            baseDeduct = exchangeStock[i].baseAmount;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalSelling - totalBuying, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            costExchangeId: exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }
                } else if (convertTo == "THB") {
                    //USD->THB
                    let baseDeduct = 0;
                    let exchangeId = '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount * exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount * exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount * exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            baseDeduct = exchangeStock[i].baseAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalSelling - totalBuying, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            costExchangeId: exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }
                }
            } else if (baseCurrency == "KHR") {
                if (convertTo == "USD") {
                    //khr -> USD
                    let baseDeduct = 0;
                    let exchangeId = '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount / exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount / exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            baseDeduct = exchangeStock[i].baseAmount;
                            exchangeId = exchangeStock[i].exchangeId;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalBuying - totalSelling, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            exchangeId: exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }

                } else if (convertTo == "THB") {
                    let baseDeduct = 0;
                    let exchangeId= '';
                    if (enoughAmount > 0) {
                        if (exchangeStock[i].baseAmount - enoughAmount > 0) {
                            amountBuyingConvert = enoughAmount / exchangeStock[i].buying;
                            amountSellingConvert = enoughAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            baseDeduct = enoughAmount;
                            exchangeId=exchangeStock[i].exchangeId;
                            enoughAmount = 0;
                        } else {
                            amountBuyingConvert = exchangeStock[i].baseAmount / exchangeStock[i].buying;
                            amountSellingConvert = exchangeStock[i].baseAmount / exchangeStock[i].selling;
                            income = amountSellingConvert - amountBuyingConvert;
                            enoughAmount -= exchangeStock[i].baseAmount;
                            baseDeduct = exchangeStock[i].baseAmount;
                            exchangeId=exchangeStock[i].exchangeId;
                        }
                        totalBuying += math.round(amountBuyingConvert, 2);
                        totalSelling += math.round(amountSellingConvert, 2);
                        netIncome += math.round(totalBuying - totalSelling, 2);
                        totalBaseAmount += baseDeduct;
                        tempEx.push({
                            costExchangeId:exchangeId,
                            costBaseCurrency: baseCurrency,
                            costConvertTo: convertTo,
                            costBaseAmountBuying: parseFloat(baseDeduct),
                            costBuyRate: exchangeStock[i].buying,
                            costSellRate: exchangeStock[i].selling,
                            costConvertBuy: parseFloat(amountBuyingConvert),
                            costConvertSell: parseFloat(amountSellingConvert)
                        });
                    }
                }
            }
        }
            // console.log(totalBaseAmount);
            // console.log(tempEx);
            // console.log(totalBuying);
            // console.log(totalSelling);
            // console.log(netIncome);
        return {
            totalBaseAmount: totalBaseAmount,
            tempEx: tempEx,
            totalBuying: totalBuying,
            totalSelling: totalSelling,
            netIncome: netIncome,
            // netIncome: totalSelling - totalBuying,
        };
    }
});


