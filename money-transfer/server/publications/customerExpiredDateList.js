import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {Customer} from '../../common/collections/customer';

Meteor.publish('moneyTransfer.customerExpiredDateList', function (limit, searchValue) {
    this.unblock();
    Meteor._sleepForMs(200);
    if (this.userId) {
        let currentDate = moment().toDate();
        if (!searchValue) {
            return Customer.find({expiredDate: {$lt: currentDate}}, {limit: limit});
        }
        return Customer.find({expiredDate: {$lt: currentDate}, $text: {$search: searchValue}}, {limit: limit});
    }
    return this.ready();
});

