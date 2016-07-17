import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {ThaiService} from '../../imports/api/collections/thai-service.js';

Meteor.publish('moneyTransfer.thaiServiceById', function simpleThaiService(thaiServiceId) {
    this.unblock();

    new SimpleSchema({
        itemId: {type: String}
    }).validate({selector, options});

    if (this.userId) {
        let data = ThaiService.find({_id: thaiServiceId});
        return data;
    }

    return this.ready();
});
