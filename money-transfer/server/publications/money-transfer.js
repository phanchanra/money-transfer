import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {MoneyTransfer} from '../../imports/api/collections/money-transfer';

Meteor.publish('moneyTransfer.moneyTransferById', function simpleMoneyTransfer({moneyTransferId}) {
    this.unblock();
    if (this.userId) {
        let data = MoneyTransfer.find({_id: moneyTransferId});
        return data;
    }

    return this.ready();
});
// Meteor.publish('moneyTransfer.fromThaiById', function simpleFromThai({fromThaiId}) {
//     this.unblock();
//     if (this.userId) {
//         let data = FromThai.find({_id: fromThaiId});
//         return data;
//     }
//
//     return this.ready();
// });
