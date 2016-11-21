import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Transfer} from '../../common/collections/transfer';

Meteor.publish('moneyTransfer.transferById', function moneyTransferTransfer(transferId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        transferId: {type: String}
    }).validate({transferId});

    if (!this.userId) {
        return this.ready();
    }

    return Transfer.find({_id: transferId});
});
