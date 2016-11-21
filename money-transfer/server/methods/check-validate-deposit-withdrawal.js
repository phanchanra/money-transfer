import {Fee} from '../../common/collections/fee';
Meteor.methods({
    checkValidateDepositWithdrawal: function (productId, currencyId) {
        let fee = Fee.findOne({productId: productId, currencyId: currencyId});
        if (fee) {
            if (fee.os == undefined || fee.os == null) {
                return false;
            }else{
                return true;
            }
        }
    }
});