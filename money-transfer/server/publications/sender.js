import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Sender} from '../../imports/api/collections/sender.js';

Meteor.publish('moneyTransfer.senderById', function simpleItem(senderId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = Sender.find({_id: senderId});
        return data;
    }

    return this.ready();
});
