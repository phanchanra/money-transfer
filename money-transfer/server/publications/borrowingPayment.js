import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {BorrowingPayment} from '../../common/collections/borrowingPayment';

Meteor.publish('moneyTransfer.borrowingPaymentById', function moneyTransferBorrowingPaymentById(borrowingPaymentId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        borrowingPaymentId: {type: String}
    }).validate({borrowingPaymentId});

    if (!this.userId) {
        return this.ready();
    }

    return BorrowingPayment.find({_id: borrowingPaymentId});
});
