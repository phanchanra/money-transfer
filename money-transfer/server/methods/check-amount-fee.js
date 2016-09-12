import {Fee} from '../../common/collections/fee';
Meteor.methods({
    getFee: function (productId, currencyId, amount) {
        if (productId && currencyId && amount) {
            let fees = Fee.findOne({productId: productId, currencyId: currencyId});
            var tmpFee = [];
            fees.service.forEach(function (obj) {
                if (amount >= obj.fromAmount && amount <= obj.toAmount) {
                    tmpFee.push({
                        fromAmount: obj.fromAmount,
                        toAmount: obj.toAmount,
                        customerFee: obj.customerFee,
                        ownerFee: obj.ownerFee,
                        agentFee: obj.agentFee,
                        totalFee: obj.customerFee,
                        totalAmount: amount + obj.customerFee
                    });
                }
            });
            return _.last(tmpFee);
        } else {
            return false;
        }
    }

});