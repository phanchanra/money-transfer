import {Currency} from '../../../core/common/collections/currency';
Meteor.methods({
    currencyExchangeRate: function (baseCurrency) {
        let exchanges = Currency.find({_id: {$ne: baseCurrency}});
        if (exchanges.count() > 0) {
            let currencies = exchanges.map(function (e) {
                return e._id;
            });
            return currencies;
        } else {
            return [];
        }
    }
});