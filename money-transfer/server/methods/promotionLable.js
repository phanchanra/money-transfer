import {Promotion} from '../../common/collections/promotion';
Meteor.methods({
    promotionLabel(transferDate) {
        // tmpPromotion=[];
        if (transferDate) {
            let promotions = Promotion.findOne({
                startDate: {$lt: moment(transferDate, "DD/MM/YYYY").add(1, 'days').toDate()},
                expiredDate: {$gte: moment(transferDate, "DD/MM/YYYY").toDate()}
            });
            if (promotions) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

});