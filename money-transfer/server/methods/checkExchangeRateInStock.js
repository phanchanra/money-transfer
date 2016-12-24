import {ExchangeStock} from '../../common/collections/exchange-stock';
Meteor.methods({
    checkExchangeRateInStock: function (id) {
        let checkExchangeStock = ExchangeStock.find({exchangeId: id});
        //let checkStatus = [];
        // checkExchangeStock.forEach(function (obj) {
        //     checkStatus.push({
        //         status: obj.status
        //     });
        //     //return obj.status;
        // });
        let checkStatus = {};
        checkExchangeStock.forEach(function (obj) {
            checkStatus = obj.status;
            //return obj.status;
            // checkStatus.push({
            //             status: obj.status
            //         });
            // console.log(checkStatus);

        });
        return checkStatus;
    }
});