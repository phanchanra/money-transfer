import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});

import {Fee} from '../../common/collections/fee';
Meteor.methods({
    getFee(productId, currencyId, amount, type) {
        if (productId && currencyId && amount && type) {
            let fees = Fee.findOne({productId: productId, currencyId: currencyId});
            var tmpFee = [];
            // console.log(fees);
            fees.service.forEach(function (obj) {
                if (amount >= obj.fromAmount && amount <= obj.toAmount) {
                    console.log(fees.status);
                    if (fees.status == true) {
                        if (type == "OUT") {
                            tmpFee.push({
                                fromAmount: obj.fromAmount,
                                toAmount: obj.toAmount,
                                customerFee: obj.customerFee,
                                ownerFee: obj.ownerFee,
                                agentFee: obj.agentFeeOut,
                                totalFee: obj.customerFee,
                                totalAmount: new BigNumber(amount).add(new BigNumber(obj.customerFee)).toFixed(2)
                            });
                        } else {
                            tmpFee.push({
                                fromAmount: obj.fromAmount,
                                toAmount: obj.toAmount,
                                customerFee: obj.customerFee,
                                ownerFee: obj.ownerFee,
                                agentFee: obj.agentFee,
                                totalFee: obj.customerFee,
                                totalAmount: new BigNumber(amount).add(new BigNumber(obj.customerFee)).toFixed(2)
                            });
                        }
                    } else {
                        tmpFee.push({
                            fromAmount: obj.fromAmount,
                            toAmount: obj.toAmount,
                            customerFee: obj.customerFee,
                            ownerFee: obj.ownerFee,
                            agentFee: obj.agentFee,
                            totalFee: obj.customerFee,
                            totalAmount: new BigNumber(amount).add(new BigNumber(obj.customerFee)).toFixed(2)
                        });
                    }
                }
            });
             console.log(tmpFee);
            return _.last(tmpFee);
        } else {
            return false;
        }
    }

});