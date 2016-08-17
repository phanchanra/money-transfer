import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Supplier} from '../../imports/api/collections/supplier';

Meteor.publish('moneyTransfer.supplier', function () {


    // new SimpleSchema({
    //     baseCurrencyExchangeId: {type: String}
    // }).validate({selector, options});

    if (this.userId) {
        this.unblock();
        let data = Supplier.find();

        return data;
    }

    return this.ready();
});
// Reactive Table
ReactiveTable.publish("moneyTransfer.reactiveTable.supplier", Supplier);