import {Fee} from '../../imports/api/collections/fee';
Meteor.methods({
    productAvailable: function (productId, currencyId, feeId) {
        if(productId && currencyId){
            let fee = Fee.findOne({productId: productId, currencyId:currencyId, _id: {$ne: feeId}});
            if (fee) {
                return true;
            } else {
                return false;
            }
        }else{
            return false;
        }


    }
});