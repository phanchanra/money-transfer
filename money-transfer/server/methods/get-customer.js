import {Customer} from '../../common/collections/customer';
Meteor.methods({
    getCustomer: function (customerId) {
        return Customer.findOne(customerId);
    }
});