import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
Meteor.methods({
    updateFeeAfterRemoveTransferAndBankAccount({doc}){
        let feeUpdateOnTransfer = {};
        let transferOnTransfer = Transfer.findOne({
            productId: doc.productId,
            currencyId: doc.currencyId,
            _id: {$ne: doc._id}
        }, {sort: {_id: -1}});
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId}, {sort: {_id: -1}});
        Meteor.defer(function () {
            if (doc.type == 'IN' || doc.type == 'OUT') {
                if (transferOnTransfer.lastBalance == '' || transferOnTransfer.lastBalance == null || transferOnTransfer.lastBalance == "undefined") {
                    Fee.direct.update(
                        fee._id,
                        {
                            $set: {
                                os: {
                                    balanceAmount: transferOnTransfer.balanceAmount,
                                    balanceAmountFee: transferOnTransfer.balanceAmount
                                }
                            }
                        }
                    );
                } else {
                    feeUpdateOnTransfer['os.date'] = new Date();
                    feeUpdateOnTransfer['os.balanceAmount'] = transferOnTransfer.lastBalance.balanceAmount;
                    feeUpdateOnTransfer['os.balanceAmountFee'] = transferOnTransfer.lastBalance.balanceAmountFee;
                    feeUpdateOnTransfer['os.customerFee'] = transferOnTransfer.lastBalance.customerFee;
                    feeUpdateOnTransfer['os.ownerFee'] = transferOnTransfer.lastBalance.ownerFee;
                    feeUpdateOnTransfer['os.agentFee'] = transferOnTransfer.lastBalance.agentFee;
                    Fee.direct.update(
                        fee._id,
                        {
                            $set: feeUpdateOnTransfer
                        }
                    );
                }
                Meteor.call('updateCustomerExpireDayAfterRemove', {doc});
            } else {
                if (transferOnTransfer) {
                    Fee.direct.update(
                        fee._id,
                        {
                            $set: {
                                os: {
                                    balanceAmount: transferOnTransfer.balanceAmount,
                                    balanceAmountFee: transferOnTransfer.balanceAmount
                                }
                            }
                        }
                    );
                } else {
                    Fee.direct.update(
                        fee._id,
                        {
                            $unset: {
                                os: {
                                    balanceAmount: '',
                                    balanceAmountFee: ''
                                }
                            }
                        }
                    );
                }
            }
        });
    }
});