import {Fee} from '../../common/collections/fee';
//import {Currency} from '../../../core/common/collections/currency';
Meteor.methods({
    getCurrency: function (productId) {
        let fees = Fee.find({productId: productId});
        if (fees.count() > 0) {
            let currencies = fees.map(function (f) {
                return f.currencyId;
            });
            return currencies;
        } else {
            return [];
        }
    }
});