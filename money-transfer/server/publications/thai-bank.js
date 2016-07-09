import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {ThaiBank} from '../../imports/api/collections/thai-bank.js';

Meteor.publish('moneyTransfer.thaiBankById', function simpleItem(thaiBankId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = ThaiBank.find({_id: thaiBankId});
        return data;
    }

    return this.ready();
});
