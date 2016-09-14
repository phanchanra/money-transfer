import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
Meteor.methods({
    updateTransferFeeAfterUpdateTransfer({doc}){
        Meteor.defer(function () {
            let setObjTransfer = {};
            let setObjFee = {};
            let feeUpdate = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
            let transferUpdate = Transfer.findOne(
                {
                    productId: doc.productId,
                    currencyId: doc.currencyId,
                    _id: {$ne: doc._id}
                },
                {
                    sort: {
                        _id: -1
                    }
                }
            );

            if (doc.type == "IN") {
                //check undefined
                if (transferUpdate.lastBalance == null || transferUpdate.lastBalance == "undefined") {
                    let balanceAmount = transferUpdate.balanceAmount + doc.amount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = balanceAmount + doc.feeDoc.agentFee;
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = doc.feeDoc.agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //update balance fee
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = doc.feeDoc.agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                } else {
                    //for update Transfer
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmount = transferUpdate.balanceAmount + doc.amount;
                    let balanceAmountFee = transferUpdate.lastBalance.balanceAmountFee + (doc.amount + doc.feeDoc.agentFee);
                    let customerFee = transferUpdate.customerFee + doc.customerFee;
                    let ownerFee = transferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                    let agentFee = transferUpdate.lastBalance.agentFee + doc.feeDoc.agentFee;

                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = customerFee;
                    setObjFee['os.ownerFee'] = ownerFee;
                    setObjFee['os.agentFee'] = agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }
                Meteor.call('updateCustomerExpireDay', {doc});
            } else if (doc.type == "OUT") {
                //check undefined
                if (transferUpdate.lastBalance == null || transferUpdate.lastBalance == "undefined") {
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = (balanceAmount + doc.feeDoc.agentFee);
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = doc.feeDoc.agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    //let balanceAmount = balanceAmount;
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = doc.feeDoc.agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                } else {
                    //update Transfer
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let customerFee = transferUpdate.customerFee + doc.customerFee;
                    let ownerFee = transferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                    let agentFee = transferUpdate.lastBalance.agentFee + doc.feeDoc.agentFee;
                    let balanceAmountFee = (transferUpdate.lastBalance.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;

                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id,
                        {
                            $set: setObjTransfer

                        }
                    );
                    //update fee balance
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = customerFee;
                    setObjFee['os.ownerFee'] = ownerFee;
                    setObjFee['os.agentFee'] = agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }
                Meteor.call('updateCustomerExpireDay', {doc});
            }
        });
    }
});