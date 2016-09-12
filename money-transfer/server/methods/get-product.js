import {Product} from '../../common/collections/product';
Meteor.methods({
    getProduct: function (productId) {
        return Product.findOne(productId);
    }
});