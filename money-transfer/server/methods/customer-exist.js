//import {Customer} from '../../common/collections/customer';
import {Transfer} from '../../common/collections/transfer';
Meteor.methods({
    customerExist: function(id) {
            return Transfer.findOne({senderId:id}) || Transfer.findOne({receiverId:id});
    }
});