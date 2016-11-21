import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {ExchangeRate} from '../../common/collections/exchange-rate';
Meteor.publish('moneyTransfer.exchangeRateById', function moneyTransferExchangeRate(exchangeRateId) {
    this.unblock();
    Meteor._sleepForMs(200);
    new SimpleSchema({exchangeRateId: {type: String}}).validate({exchangeRateId});
    if (!this.userId) {
        return this.ready();
    }

    return ExchangeRate.find({_id: exchangeRateId});
});