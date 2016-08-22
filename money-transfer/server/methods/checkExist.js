import {Fee} from '../../imports/api/collections/fee';
Meteor.methods({
    productAvailable: function (productId, currencyId) {
        if(productId && currencyId){
            let fee = Fee.findOne({productId: productId, currencyId:currencyId});
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