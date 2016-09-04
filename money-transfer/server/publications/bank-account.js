import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
//import {Transfer} from '../../imports/api/collections/transfer';
import {Transfer} from '../../imports/api/collections/transfer';

Meteor.publish('moneyTransfer.bankAccountById', function moneyTransferBankAccount(bankAccountId) {
    this.unblock();
    Meteor._sleepForMs(200);

    new SimpleSchema({
        bankAccountId: {type: String}
    }).validate({bankAccountId});

    if (!this.userId) {
        return this.ready();
    }

    return Transfer.find({_id: bankAccountId});
});
