import {Fee} from '../../common/collections/fee';
Meteor.methods({
    productAvailableInsert: function (productId, currencyId) {
        if(productId && currencyId){
            let fee = Fee.findOne({productId: productId, currencyId:currencyId});
            if (fee) {
                //console.log(fee);
                return fee._id;
            } else {
                return false;
            }
        }else{
            return false;
        }


    }
});