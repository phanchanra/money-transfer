import {Customer} from '../../common/collections/customer';
Meteor.methods({
    updateCustomerExpireDay({doc}){
        let customerNotificationDay = Customer.findOne({_id: doc.senderId});
        expired = moment(doc.transferDate).add(customerNotificationDay.notificationDay, 'days').toDate();
        Customer.direct.update(
            customerNotificationDay._id,
            {
                $set: {
                    expiredDate: expired,
                    lastInvoice: doc._id,
                }
            }
        );
    },
});