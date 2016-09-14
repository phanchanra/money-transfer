import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Customer} from '../../common/collections/customer';

//Meteor.publish('moneyTransferCustomerExpiredDate', function moneyTransferCustomerExpiredDate() {
// this.unblock();
// Meteor._sleepForMs(200);
//
// new SimpleSchema({
//     customerId: {type: String}
// }).validate({});
//
// if (!this.userId) {
//     return this.ready();
// }
// return Customer.find({});
//});
Meteor.publish('moneyTransfer.customerExpiredDate', function (limit) {
    if (this.userId) {
        this.unblock();
        let currentDate = moment().toDate();
        Meteor._sleepForMs(200);
        return Customer.find({expiredDate: {$lt: currentDate}}, limit);
    }
    return this.ready();
});

