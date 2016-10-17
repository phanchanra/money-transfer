import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});
import {Promotion} from '../../common/collections/promotion';
Meteor.methods({
    newPromotion(promotionId, transferDate, customerFee) {
        // tmpPromotion=[];
        let amount = 0;
        if (promotionId && transferDate && customerFee) {
            let promotions = Promotion.findOne({
                _id: promotionId,
                startDate: {$lt: moment(transferDate, "DD/MM/YYYY").add(1, 'days').toDate()},
                expiredDate: {$gte: moment(transferDate, "DD/MM/YYYY").toDate()}
            });
            if (promotions.type == 'percent') {
                //amount = totalFee * (1 - promotions.amount / 100);
                amount = new BigNumber(customerFee).times(new  BigNumber(promotions.amount).div(new BigNumber(100))).toFixed(2);
                return amount;
            } else {
                amount =new BigNumber(promotions.amount).toFixed(2);
                return amount
            }
        } else {
            return false;
        }
    }

});