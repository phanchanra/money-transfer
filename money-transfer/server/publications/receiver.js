import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Receiver} from '../../imports/api/collections/receiver.js';

Meteor.publish('moneyTransfer.receiverById', function simpleReceiver(receiveId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = Receiver.find({_id: receiveId});
        return data;
    }

    return this.ready();
});
