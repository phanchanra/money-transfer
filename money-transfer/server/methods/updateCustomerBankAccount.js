import {Customer} from '../../common/collections/customer';
Meteor.methods({
    updateCustomerBankAccount({doc}){
        let customerBankAccount = Customer.findOne({_id: doc.receiverId});
        Customer.direct.update(
            customerBankAccount._id,
            {
                $set: {
                    bankName: doc.bankName,
                    bankNumber: doc.bankNumber
                }
            }
        );
    }
});