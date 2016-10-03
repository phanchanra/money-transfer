import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Transaction} from '../../common/collections/transaction.js';

Meteor.publish('cash.transactionById', function simpleTransaction(transactionId) {
    this.unblock();

    new SimpleSchema({
        transactionId: {type: String}
    }).validate({transactionId});

    if (!this.userId) {
        return this.ready();
    }

    return Transaction.find({_id: transactionId});
});
