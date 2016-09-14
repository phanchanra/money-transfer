import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Borrowing} from '../../common/collections/borrowing';

Meteor.publish('moneyTransfer.borrowingById', function moneyTransferBorrowingById(borrowingId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        borrowingId: {type: String}
    }).validate({borrowingId});

    if (!this.userId) {
        return this.ready();
    }

    return Borrowing.find({_id: borrowingId});
});
