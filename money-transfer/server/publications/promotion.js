import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
// Collection
import {Promotion} from '../../common/collections/promotion';
Meteor.publish('moneyTransfer.promotionById', function moneyTransferPromotionById({promotionId, date}) {
    this.unblock();
    Meteor._sleepForMs(200);
    let selector = {};
    if (this.userId) {
       if(promotionId) {
           selector._id = promotionId;
       }else{
           selector.startDate = {$lt: moment(date, "DD/MM/YYYY").add(1, 'days').toDate()};
           selector.expiredDate = {$gte: moment(date, "DD/MM/YYYY").toDate()};
       }
        return Promotion.find(selector);
    }
    return this.ready();
});
