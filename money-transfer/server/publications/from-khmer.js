import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {FromKhmer} from '../../imports/api/collections/from-khmer.js';

Meteor.publish('moneyTransfer.fromKhmerById', function simpleFromKhmer(fromKhmerId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = FromKhmer.find({_id: fromKhmerId});
        return data;
    }

    return this.ready();
});
