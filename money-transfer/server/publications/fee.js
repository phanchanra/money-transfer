import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Fee} from '../../imports/api/collections/fee';

Meteor.publish('moneyTransfer.feeById', function moneyTransferFee(feeId) {
    this.unblock();

    new SimpleSchema({
        feeId: {type: String}
    }).validate({feeId});

    if (!this.userId) {
        return this.ready();
    }

    return Fee.find({_id: feeId});
});
