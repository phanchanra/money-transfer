import {Fee} from '../../common/collections/fee';
Meteor.methods({
    updateFeeAfterInsertTransfer({doc}){
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        if (doc.transferType == 'khmer') {
            if (doc.type == "IN") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: fee.os.balanceAmount + doc.amount,
                                customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                                ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                                agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                                balanceAmountFee: (fee.os.balanceAmountFee + doc.amount)+ doc.feeDoc.agentFee
                            }
                        }
                    }
                );

            } else if (doc.type == "OUT") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: fee.os.balanceAmount - doc.amount,
                                customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                                ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                                agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                                balanceAmountFee: (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount
                            }
                        }
                    }
                );
                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            }
        } else {
            if (doc.type == "IN") {
                let printAmount = doc.amount - doc.totalFee;
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: fee.os.balanceAmount + printAmount,
                                customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                                ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                                agentFee: fee.os.agentFee == null ? doc.totalFee : fee.os.agentFee + doc.totalFee,
                                balanceAmountFee: (fee.os.balanceAmountFee + printAmount) + doc.totalFee
                            }
                        }
                    }
                );
                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            } else if (doc.type == "OUT") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: fee.os.balanceAmount - doc.amount,
                                customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                                ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                                agentFee: fee.os.agentFee == null ? doc.totalFee : fee.os.agentFee + doc.totalFee,
                                balanceAmountFee: (fee.os.balanceAmountFee + doc.totalFee) - doc.amount
                            }
                        }
                    }
                );
                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            }
        }

    }
});