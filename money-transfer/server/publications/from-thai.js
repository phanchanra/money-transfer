import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {FromThai} from '../../imports/api/collections/from-thai.js';

Meteor.publish('moneyTransfer.fromThaiById', function simpleFromThai(fromThaiId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = FromThai.find({_id: fromThaiId});
        return data;
    }

    return this.ready();
});
