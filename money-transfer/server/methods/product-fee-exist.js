import {Transfer} from '../../common/collections/transfer';
Meteor.methods({
    productFeeExist: function(productId, currencyId) {
            return Transfer.findOne({productId:productId, currencyId:currencyId});
    }
});