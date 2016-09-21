import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Provider} from '../../common/collections/provider';

Meteor.publish('moneyTransfer.providerById', function moneyTransferCustomer(providerId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        providerId: {type: String}
    }).validate({providerId});

    if (!this.userId) {
        return this.ready();
    }

    return Provider.find({_id: providerId});
});
