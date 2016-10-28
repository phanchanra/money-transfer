import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
Meteor.methods({
    updateTransferFeeAfterUpdateTransfer({doc}){
        //Meteor.defer(function () {
        let setObjTransfer = {};
        let setObjFee = {};
        let feeUpdate = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        let transferUpdate = Transfer.findOne(
            {
                productId: doc.productId,
                currencyId: doc.currencyId
            },
            {
                sort: {
                    _id: -1
                }
            }
        );
        let previousTransferUpdate = Transfer.findOne(
            {
                productId: doc.productId,
                currencyId: doc.currencyId,
                _id: {$ne: transferUpdate._id}
            },
            {
                sort: {
                    _id: -1
                }
            }
        );
        if (doc.transferType == 'khmer') {
            if (doc.type == "IN") {
                if (previousTransferUpdate) {
                    let balanceAmountFee = 0;
                    let customerFee = 0;
                    let ownerFee = 0;
                    let agentFee = 0;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    //let printAmount = doc.amount - doc.totalFee;
                    // let printAmount = doc.amount - doc.totalFee;
                    let balanceAmount = previousTransferUpdate.balanceAmount + doc.amount;

                    if (previousTransferUpdate.lastBalance) {
                        balanceAmountFee = previousTransferUpdate.lastBalance.balanceAmountFee + (doc.amount + agentFeeAfterDis);
                        ownerFee = previousTransferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                        agentFee = previousTransferUpdate.lastBalance.agentFee + agentFeeAfterDis;
                        customerFee = previousTransferUpdate.lastBalance.customerFee + doc.customerFee;

                    } else {
                        balanceAmountFee = previousTransferUpdate.balanceAmount + (doc.amount + agentFeeAfterDis);
                        ownerFee = doc.feeDoc.ownerFee;
                        agentFee = agentFeeAfterDis;
                        customerFee = doc.feeDoc.customerFee;
                    }
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
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
                } else {
                    // let printAmount = doc.amount - doc.totalFee;
                    let balanceAmount = transferUpdate.balanceAmount + doc.amount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = doc.amount + agentFeeAfterDis;
                    // let balanceAmountFee = balanceAmount + doc.feeDoc.agentFee;
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.feeDoc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFeeAfterDis;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
                            $set: setObjTransfer
                        }
                    );
                    //update balance fee
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.feeDoc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFeeAfterDis;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }

                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            } else if (doc.type == "OUT") {
                if (previousTransferUpdate) {
                    //update Transfer
                    let balanceAmountFee = 0;
                    let ownerFee = 0;
                    let agentFee = 0;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmount = previousTransferUpdate.balanceAmount - doc.amount;
                    let customerFee = 0;
                    if (previousTransferUpdate.lastBalance) {
                        customerFee = previousTransferUpdate.customerFee + doc.feeDoc.customerFee;
                        ownerFee = previousTransferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                        agentFee = previousTransferUpdate.lastBalance.agentFee + doc.feeDoc.agentFee;
                        balanceAmountFee = (previousTransferUpdate.lastBalance.balanceAmountFee + agentFeeAfterDis) - doc.amount;
                    } else {
                        customerFee = doc.feeDoc.customerFee;
                        ownerFee = doc.feeDoc.ownerFee;
                        agentFee = doc.feeDoc.agentFee;
                        balanceAmountFee = (previousTransferUpdate.balanceAmount + agentFee) - doc.amount;
                    }
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id,
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
                } else {
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = (balanceAmount + agentFeeAfterDis);
                    // let balanceAmountFee = (balanceAmount + doc.feeDoc.agentFee);
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFeeAfterDis;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    //let balanceAmount = balanceAmount;
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFeeAfterDis;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }

                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            }

        } else {//thai
            if (doc.type == "IN") {
                if (previousTransferUpdate) {
                    let balanceAmountFee = 0;
                    let ownerFee = 0;
                    let agentFee = 0;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let printAmount = doc.amount - doc.totalFee;
                    let balanceAmount = previousTransferUpdate.balanceAmount + printAmount;
                    let customerFee = 0;

                    if (previousTransferUpdate.lastBalance) {
                        balanceAmountFee = previousTransferUpdate.lastBalance.balanceAmountFee + (printAmount + agentFeeAfterDis);
                        customerFee = previousTransferUpdate.customerFee + doc.feeDoc.customerFee;
                        ownerFee = previousTransferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                        agentFee = previousTransferUpdate.lastBalance.agentFee + agentFeeAfterDis;
                    } else {
                        balanceAmountFee = previousTransferUpdate.balanceAmount + (printAmount + agentFeeAfterDis);
                        ownerFee = doc.feeDoc.ownerFee;
                        agentFee = agentFeeAfterDis;
                        customerFee = doc.feeDoc.customerFee;
                    }

                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
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
                } else {
                    let printAmount = doc.amount - doc.totalFee;
                    let balanceAmount = transferUpdate.balanceAmount + printAmount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = balanceAmount + agentFeeAfterDis;
                    // let balanceAmountFee = balanceAmount + doc.feeDoc.agentFee;
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFeeAfterDis;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
                            $set: setObjTransfer
                        }
                    );
                    //update balance fee
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFeeAfterDis;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }

                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            } else if (doc.type == "OUT") {
                if (previousTransferUpdate) {
                    //update Transfer
                    let balanceAmountFee = 0;
                    let ownerFee = 0;
                    let agentFee = 0;
                    let balanceAmount = 0;
                    let customerFee = 0;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    if (previousTransferUpdate.lastBalance) {
                        balanceAmount = previousTransferUpdate.balanceAmount - doc.amount;
                        customerFee = previousTransferUpdate.customerFee + doc.feeDoc.customerFee;
                        ownerFee = previousTransferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                        agentFee = previousTransferUpdate.lastBalance.agentFee + agentFeeAfterDis;
                        balanceAmountFee = (previousTransferUpdate.lastBalance.balanceAmountFee + agentFeeAfterDis) - doc.amount;
                    } else {
                        customerFee = doc.feeDoc.customerFee;
                        ownerFee = doc.feeDoc.ownerFee;
                        agentFee = agentFeeAfterDis;
                        balanceAmountFee = (previousTransferUpdate.balanceAmount + agentFeeAfterDis) - doc.amount;
                    }
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id,
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
                } else {
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let agentFeeAfterDis = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = (balanceAmount + agentFeeAfterDis);
                    // let balanceAmountFee = (balanceAmount + doc.feeDoc.agentFee);
                    //update transfer
                    setObjTransfer.agentFee = agentFeeAfterDis;
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.date'] = new Date();
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFeeAfterDis;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        transferUpdate._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    //let balanceAmount = balanceAmount;
                    setObjFee['os.date'] = new Date();
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFeeAfterDis;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }

                if (doc.senderId) {
                    Meteor.call('updateCustomerExpireDay', {doc});
                }
            }
        }
    }
});