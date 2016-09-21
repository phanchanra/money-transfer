import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Customer} from '../../common/collections/customer';

Meteor.publish('moneyTransfer.customerById', function moneyTransferCustomerById(customerId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        customerId: {type: String}
    }).validate({customerId});

    if (!this.userId) {
        return this.ready();
    }

    return Customer.find({_id: customerId});
});
