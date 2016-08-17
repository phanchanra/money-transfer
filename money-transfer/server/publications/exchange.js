import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Exchange} from '../../imports/api/collections/exchange.js';

Meteor.publish('moneyTransfer.exchange', function () {


    // new SimpleSchema({
    //     baseCurrencyExchangeId: {type: String}
    // }).validate({selector, options});

    if (this.userId) {
        this.unblock();
        let data = Exchange.find();

        return data;
    }

    return this.ready();
});
// Reactive Table
ReactiveTable.publish("moneyTransfer.reactiveTable.exchange", Exchange);