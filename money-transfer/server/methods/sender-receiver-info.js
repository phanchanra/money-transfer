import {Customer} from '../../common/collections/customer';

Meteor.methods({
    getCustomerInfo:function (customerId) {
        let customer=Customer.findOne(customerId);
        if(customer){
            return customer;
        }else{
            return '';
        }
    }
});