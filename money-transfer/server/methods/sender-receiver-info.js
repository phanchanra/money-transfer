import {Customer} from '../../imports/api/collections/customer';

Meteor.methods({
    getCustomerInfo:function (customerId) {
        let customer=Customer.findOne(customerId);
        if(customer){
            return customer.telephone;
        }else{
            return '';
        }
    }
});