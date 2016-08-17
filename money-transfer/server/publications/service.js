import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Service} from '../../imports/api/collections/service';

Meteor.publish('moneyTransfer.service', function () {


    // new SimpleSchema({
    //     baseCurrencyExchangeId: {type: String}
    // }).validate({selector, options});

    if (this.userId) {
        this.unblock();
        let data = Service.find();

        return data;
    }

    return this.ready();
});
// Reactive Table
ReactiveTable.publish("moneyTransfer.reactiveTable.service", Service);