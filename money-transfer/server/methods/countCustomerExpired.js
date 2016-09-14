import {Transfer} from '../../common/collections/transfer';
import {Customer} from '../../common/collections/customer';
Meteor.methods({
    countCustomerExpired(){
        let customerCount = Customer.find();
        tmp = [];
        customerCount.forEach(function (key, value) {
            tmp.push({
                label:key,
                value:value
            });
        });
        return tmp;

    }
});