import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {CashIn} from '../../imports/api/collections/cash-in.js';

Meteor.publish('moneyTransfer.cashInById', function simpleCashIn(CashInId) {
    this.unblock();

    new SimpleSchema({
        cashInId: {type: String},
    }).validate({selector, options});

    if (this.userId) {
        let data = CashIn.find({_id: CashInId});

        return data;
    }

    return this.ready();
});
