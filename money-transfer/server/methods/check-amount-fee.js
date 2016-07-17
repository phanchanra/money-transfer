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
    dynamicCurrency(currency, amount,){
        let data;
        let exchangeRate = Exchange.findOne({}, {sort: {_id: -1}});
        if(currency=='KHM'){
            //khmer to usd
            let dataUsd=amount/exchangeRate.rates.KHR;
            //khmer to thb
            let dataBath=amount/exchangeRate.rates.THB;
            data = amount-(dataUsd+dataBath);

        }else if(currency=='USD'){
            //dollar to Bath
            let dataBath=amount*exchangeRate.rates.THB;
            //dollar to khmer
            let dataKhr=amount*exchangeRate.rates.KHR;
            data = amount-(dataBath+dataKhr);

        }else if(currency=='THB'){
            //Bath to khmer
            let dataKhmer=amount*exchangeRate.rates.THB;
            //bath to usd
            let dataUsd=amount/exchangeRate.rates.THB;
            data = amount-(dataKhmer+dataUsd);

        }
        return data;

    }

});