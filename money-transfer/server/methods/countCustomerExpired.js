import {Customer} from '../../common/collections/customer';
Meteor.methods({
    countCustomerExpired(){
        let countCustomer = Customer.findOne();
        let currentDate = moment();

        let expiredDate = moment(countCustomer.expiredDate).toDate();
        let currentDateCount=moment(currentDate).diff(expiredDate, 'days');

        console.log(currentDateCount);
        // db.moneyTransfer_customer.find({
        //     expiredDate: {$lt: currentDate}
        // })
    }
});