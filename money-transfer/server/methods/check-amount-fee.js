/**
 * Created by chanra on 7/14/16.
 */
import {ThaiService} from '../../imports/api/collections/thai-service.js';
import {Exchange} from '../../../core/imports/api/collections/exchange.js'
Meteor.methods({
    getThaiFee(amount){
        let service = ThaiService.findOne({fromAmount: {$lte: amount}, toAmount: {$gte: amount}});
        if (service) {
            return service.fee;
        }
        else {
            return 0;
        }
    },
    dynamicCurrency(currency, amount, fromAmount0, fromAmount1){
        let data;
        let data1;
        let data2;
        let exchangeRate = Exchange.findOne({}, {sort: {_id: -1}});
        if (currency == 'KHR') {
            //khmer to thb
            data1 = parseFloat(fromAmount0 / 120);
            //data1 = parseFloat(fromAmount0 / exchangeRate.rates.THB);
            //khmer to usd
            data2 = parseFloat(fromAmount1 / exchangeRate.rates.KHR);
            data = parseFloat(amount - (fromAmount0 + fromAmount1));


        } else if (currency == 'USD') {
            //dollar to khmer
            data1 = parseFloat(fromAmount0 * exchangeRate.rates.KHR);
            //dollar to Bath
            data2 = parseFloat(fromAmount1 * exchangeRate.rates.THB);
            data = parseFloat(amount - (fromAmount0 + fromAmount1));


        } else if (currency == 'THB') {
            //Bath to khmer
            //data1 = parseFloat(fromAmount0 * 120);
            data1 = parseFloat(fromAmount0 * exchangeRate.rates.THB);
            //bath to usd
            data2 = parseFloat(fromAmount1 / exchangeRate.rates.THB);
            data = parseFloat(amount - (fromAmount0 + fromAmount1));

        }
        return {res:data, ex1:data1, ex2:data2};

    }

});