import {Customer} from '../../common/collections/customer';
import {Transfer} from '../../common/collections/transfer';
Meteor.methods({
    updateCustomerExpireDayAfterRemove({doc}){
        let lastTransferRemove = Transfer.findOne({senderId: doc.senderId}, {sort: {_id: -1}});
        if (lastTransferRemove == '' || lastTransferRemove == null || lastTransferRemove == "undefined") {
            let customerNotificationDay = Customer.findOne({_id: doc.senderId});
            Customer.direct.update(
                customerNotificationDay._id,
                {
                    $unset: {
                        expiredDate: '',
                        lastInvoice: ''
                    }
                }
            );
        } else {
            let customerNotificationDay = Customer.findOne({_id: lastTransferRemove.senderId});
            let expired = moment(lastTransferRemove.transferDate).add(customerNotificationDay.notificationDay, 'days').toDate();
            Customer.direct.update(
                customerNotificationDay._id,
                {
                    $set: {
                        expiredDate: expired,
                        lastInvoice: lastTransferRemove._id
                    }
                }
            );
        }
    }
});