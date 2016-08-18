// /**
//  * Created by chanra on 7/14/16.
//  */
// import {Product} from '../../imports/api/collections/product';
// import {Exchange} from '../../imports/api/collections/exchange';
// Meteor.methods({
//     getFee(productId, amount){
//         let product = Product.findOne({_id: productId});
//         //let service = Product.findOne({_id:productId,fromAmount: {$lte: amount}, toAmount: {$gte: amount}});
//         // return {fee:parseFloat(service.fee), expend:parseFloat(service.expend), income:parseFloat(service.income)};
//         var tmpFee = [];
//         if (product.status == "Internal") {
//             product.service.forEach(function (obj) {
//                 if (amount >= obj.fromAmount &&  amount <= obj.toAmount) {
//                    tmpFee.push({
//                         fee: obj.fee,
//                         expend: obj.expend,
//                         income: obj.income
//                     });
//                 }
//             });
//         } else {
//             product.service.forEach(function (obj) {
//                 if (amount >= obj.fromAmount && amount <= obj.toAmount) {
//                     tmpFee.push({
//                         fee: obj.fee,
//                         expend: 0,
//                         income: obj.fee
//                     });
//
//                 }
//             });
//         }
//         return _.last(tmpFee);
//     },
//     dynamicCurrency(currency, amount, fromAmount0, fromAmount1){
//         let data;
//         let data1;
//         let data2;
//         let exchangeRate = Exchange.findOne({}, {sort: {_id: -1}});
//         if (currency == 'KHR') {
//             //khmer to thb
//             khmerToThb = parseFloat(exchangeRate.baseKhr.KHR / exchangeRate.baseKhr.THB);
//             data1 = parseFloat(fromAmount0 * khmerToThb);
//             //data1 = parseFloat(fromAmount0 / exchangeRate.rates.THB);
//             //khmer to usd
//             khmerToUsd = parseFloat(exchangeRate.baseKhr.KHR / exchangeRate.baseKhr.USD);
//             data2 = parseFloat(fromAmount1 * khmerToUsd);
//             data = parseFloat(amount - (fromAmount0 + fromAmount1));
//         } else if (currency == 'USD') {
//             //dollar to khmer
//             data1 = parseFloat(fromAmount0 * exchangeRate.baseUsd.KHR);
//             //dollar to Bath
//             data2 = parseFloat(fromAmount1 * exchangeRate.baseUsd.THB);
//             data = parseFloat(amount - (fromAmount0 + fromAmount1));
//         } else if (currency == 'THB') {
//             //Bath to khmer
//             //data1 = parseFloat(fromAmount0 * 120);
//             data1 = parseFloat(fromAmount0 * exchangeRate.baseThb.KHR);
//             //bath to usd
//             //thbToUsd = parseFloat(exchangeRate.baseThb.THB/exchangeRate.baseThb.USD);
//             data2 = parseFloat(fromAmount1 / exchangeRate.baseThb.USD);
//             data = parseFloat(amount - (fromAmount0 + fromAmount1));
//         }
//         return {res: data, ex1: data1, ex2: data2};
//     }
// });