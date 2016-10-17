import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Promotion} from '../../common/collections/promotion';

Meteor.publish('moneyTransfer.promotionById', function moneyTransferCustomerById(promotionId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        promotion: {type: String}
    }).validate({promotionId});

    if (!this.userId) {
        return this.ready();
    }

    return Promotion.find({_id: promotionId});
});
