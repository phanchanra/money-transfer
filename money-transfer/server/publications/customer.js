import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';

// Collection
import {Customer} from '../../imports/api/collections/customer.js';

// Meteor.publish('moneyTransfer.customerById', function simpleCustomer(customerId) {
// Meteor.publish('moneyTransfer.customerById', function simpleCustomer(customerId) {
//     this.unblock();
//
//     new SimpleSchema({
//         customerId: {type: String}
//     }).validate({customerId});
//
//     if (this.userId) {
//         let data = Customer.find({_id: customerId});
//
//         return data;
//     }
//
//     return this.ready();
// });

Meteor.publish('moneyTransfer.customer', function () {

    if (this.userId) {
        this.unblock();
        return Customer.find();
    }
    return this.ready();
});

// Reactive Table
ReactiveTable.publish("moneyTransfer.reactiveTable.customer", Customer);