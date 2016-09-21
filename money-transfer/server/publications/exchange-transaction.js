import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
Meteor.publish('moneyTransfer.exchangeTransactionById', function moneyTransferExchangeTransaction(exchangeTransactionId) {
    this.unblock();
    Meteor._sleepForMs(200);
    new SimpleSchema({exchangeTransactionId: {type: String}}).validate({exchangeTransactionId});
    if (!this.userId) {
        return this.ready();
    }

    return ExchangeTransaction.find({_id: exchangeTransactionId});
});