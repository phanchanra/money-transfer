import {Fee} from '../../common/collections/fee';
Meteor.methods({
    updateFeeAfterInsertBankAccount({doc}){
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        if (fee.productId == doc.productId && fee.currencyId == doc.currencyId) {
            if (doc.type == "CD") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: doc.balanceAmount,
                                balanceAmountFee: doc.balanceAmount
                            }
                        }
                    }
                );
            } else if (doc.type == "CW") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: doc.balanceAmount,
                                balanceAmountFee: doc.balanceAmount
                            }
                        }
                    }
                );
            }
        }
    }
});