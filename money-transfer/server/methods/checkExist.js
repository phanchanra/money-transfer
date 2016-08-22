import {Fee} from '../../imports/api/collections/fee';
Meteor.methods({
    productAvailable: function (productId, currencyId) {
        let product = Fee.findOne({productId: productId, currencyId:currencyId});
        if (product) {
            console.log(product + "A");
            return true;
        } else {
            console.log(product + "B");
            return false;
        }

    }
});