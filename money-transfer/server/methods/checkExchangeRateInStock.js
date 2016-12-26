import {ExchangeStock} from '../../common/collections/exchange-stock';
Meteor.methods({
    checkExchangeRateInStock: function (id) {
        let checkExchangeStock = ExchangeStock.find({exchangeId: id}).fetch();
        function findArr(st) {
            return st.status == 'inactive';
        }
        return checkExchangeStock.find(findArr);
    }
});
