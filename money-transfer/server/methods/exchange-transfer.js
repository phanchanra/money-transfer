import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});
import {ExchangeStock} from '../../common/collections/exchange-stock';
Meteor.methods({
    exchangeTransfer (currencyId) {
        let exchangeStock = ExchangeStock.find({
                baseCurrency: currencyId,
                baseAmount: {$gt: 0}
            },
            {sort: {_id: 1}}
        ).fetch();
        let arr = [];
        //console.log(exchangeStock);
        exchangeStock.reduce(function (key, val) {
            if (!key[val.convertTo + val.baseCurrency]) {
                key[val.convertTo + val.baseCurrency] = {
                    baseCurrency: val.baseCurrency,
                    convertTo: val.convertTo,
                    selling: val.selling,
                    buying: val.buying
                };
                arr.push(key[val.convertTo + val.baseCurrency]);
            }
            return key;
        }, {});
        ///console.log(arr);
        return arr;
    }
});
// //console.log(exchangeStock);
// let tmpStockExchange = [];
// //console.log(find_duplicate_in_array(exchangeStock));
// exchangeStock.forEach(function (e) {
//     tmpStockExchange.push({
//         convertTo: e.convertTo,
//         selling: e.selling,
//         buying: e.buying
//     });
// });
// console.log(tmpStockExchange);
// console.log(find_duplicate_in_array(tmpStockExchange));
// return {exchangeTransfer: tmpStockExchange};


// let exchangeStock = ExchangeStock.findOne({},
//     {sort: {_id: -1}}
// );
// let getConvertCurrency = [];
// if (exchangeStock && exchangeStock.balanceStock){
//     getConvertCurrency = _.filter(exchangeStock.balanceStock, function (c) {
//         return c.baseCurrency == currencyId
//     });
//     console.log(getConvertCurrency);
//     console.log(exchangeStock.exchangeId);
//     console.log(getConvertCurrency);
//     return {exchangeId: exchangeStock.exchangeId, exchangeTransfer: getConvertCurrency};
// }
//==========================================
// let exchangeRate = ExchangeRate.findOne(
//     {baseCurrency: currencyId},
//     {sort: {_id: -1}}
// );
// var tmpExchangeTransfer = [];
// if (exchangeRate) {
//     exchangeRate.convertCurrency.forEach(function (obj) {
//         tmpExchangeTransfer.push({
//             convertTo: obj.convertTo,
//             selling: obj.selling,
//             buying: obj.buying
//         });
//     });
//     //console.log({exchange: exchangeRate._id, exchangeTransfer:tmpExchangeTransfer});
//     return {exchangeId: exchangeRate._id, exchangeTransfer: tmpExchangeTransfer};
// } else {
//     return false;
// }

function find_duplicate_in_array(arra1) {
    var i,
        len = arra1.length,
        result = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arra1[i]] = 0;
    }
    for (i in obj) {
        result.push(i);
    }
    return result;
}


// var arr = [1, 2, -2, 4, 5, 4, 7, 8, 7, 7, 71, 4, 6];
// console.log(find_duplicate_in_array(arr));