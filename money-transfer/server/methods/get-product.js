import {Product} from '../../imports/api/collections/product';
Meteor.methods({
    getProduct: function (productId) {
        return Product.findOne(productId);
    }
});