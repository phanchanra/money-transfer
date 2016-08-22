import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Product} from '../../imports/api/collections/product';

Meteor.publish('moneyTransfer.productById', function moneyTransferProductById(productId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        productId: {type: String}
    }).validate({productId});

    if (!this.userId) {
        return this.ready();
    }

    return Product.find({_id: productId});
});
