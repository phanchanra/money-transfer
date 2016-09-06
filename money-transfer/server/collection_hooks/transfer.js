import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../imports/api/collections/transfer';
import {Fee} from '../../imports/api/collections/fee';
import {moneyTransferState} from '../../common/globalState/moneyTransferState';
Transfer.before.insert(function (userId, doc) {
    let lastBalance = {};
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);
    moneyTransferState.set(tmpId, doc);
    //
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    if (doc.type == "IN") {
        lastBalance.balanceAmount = fee.os.balanceAmount + doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee;
        doc.balanceAmount = (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee;
        doc.lastBalance = lastBalance;

    } else if (doc.type == "OUT") {
        lastBalance.balanceAmount = fee.os.openingAmount - doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.feeDoc.agent) - doc.amount;
        doc.balanceAmount = (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;
        doc.lastBalance = lastBalance;
    }


    // doc.tempBalance = {
    //     fromAmount: doc.feeDoc.fromAmount,
    //     toAmount: doc.feeDoc.toAmount,
    //     customerFee: doc.feeDoc.customerFee,
    //     ownerFee: doc.feeDoc.ownerFee,
    //     agentFee: doc.feeDoc.agentFee
    // };
    //
    // doc.tmpOpeningAmount = fee.os.openingAmountfee = fee.os.openingAmount == null ? 0 : fee.os.openingAmount;
    // doc.tmpCustomerFee = fee.os.customerFee = fee.os.customerFee == null ? 0 : fee.os.customerFee;
    // doc.tmpOwnerFee = fee.os.ownerFee = fee.os.ownerFee == null ? 0 : fee.os.ownerFee;
    // doc.tmpAgentFee = fee.lastAgentFee = fee.lastAgentFee == null ? 0 : fee.os.agentFee;
    // doc.tmpOpeningAmountFee = fee.os.openingAmountFee;
    // let tempOpeningAmount = fee.os.openingAmountfee = fee.os.openingAmount == null ? 0 : fee.os.openingAmount;
    // let tempCustomerFee = fee.os.customerFee = fee.os.customerFee == null ? 0 : fee.os.customerFee;
    // let tempOwnerFee = fee.os.ownerFee = fee.os.ownerFee == null ? 0 : fee.os.ownerFee;
    // let tempAgentFee = fee.lastAgentFee = fee.lastAgentFee == null ? 0 : fee.os.agentFee;
    // let tempOpeningAmountFee = fee.os.openingAmountFee;
    //
    // doc.tmpBalance({
    //     tmpOpeningAmount:tempOpeningAmount,
    //     tmpCustomerFee:tempCustomerFee,
    //     tmpOwnerFee:tempOwnerFee,
    //     tmpAgentFee:tempAgentFee,
    //     tmpOpeningAmountFee:tempOpeningAmountFee
    // });

});

Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        //let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
        //let totalOutAmountAgentFee = fee.lastOpeningAmountFee + doc.feeDoc.agentFee;
        if (doc.type == "IN") {
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: doc.transferDate,
                            balanceAmount: fee.os.balanceAmount + doc.amount,
                            customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                            ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                            agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                            balanceAmountFee: (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee
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
                            date: doc.transferDate,
                            balanceAmount: fee.os.balanceAmount - doc.amount,
                            customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                            ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                            agentFee: fee.os.agentFee == null ? doc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                            balanceAmountFee: (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount
                        }
                    }
                }
            )
        }

    });
});
//
Transfer.after.update(function (userId, doc) {
    let prevDoc = this.previous;
    let setObj = {};
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});

    //condition 1 IN => IN
    let resultAmountInIn = prevDoc.amount - (prevDoc.feeDoc.agentFee + doc.amount);
    let newBalanceAmountInIn = (prevDoc.balanceAmount + doc.feeDoc.agentFee) - resultAmountInIn;
    //condition 2 IN => OUT
    let resultAmountInOut = preDoc.amount + doc.amount;
    let newBalanceAmountInOut = preDoc.balanceAmount - resultAmountInOut;
    //condition 3 OUT => OUT
    let resultAmountOutOut = preDoc.balanceAmount - doc.amount;
    let newBalanceAmountOutOut = preDoc.amount + resultAmountOutOut;
    //condition 4 OUT => IN
    let resultAmountOutIn = preDoc.amount + preDoc.balanceAmount;
    let newBalanceAmountOutIn = resultAmountOutIn + doc.amount;

    Meteor.defer(function () {
        if (prevDoc.type == doc.type && doc.type == "IN") {
            setObj.balanceAmount = newBalanceAmountInIn;
            setObj['lastBalance.balanceAmount'] = newBalanceAmountInIn;
            setObj['lastBalance.customerFee'] = doc.customerFee;
            setObj['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
            setObj['lastBalance.agentFee'] = doc.feeDoc.agentFee;
            setObj['lastBalance.balanceAmountFee'] = newBalanceAmountInIn + doc.feeDoc.agentFee;
            Transfer.direct.update(
                doc._id, {
                    $set: setObj
                }
            );
        } else if (prevDoc.type != doc.type && doc.type == "OUT") {
            setObj.balanceAmount = newBalanceAmountInOut;
            setObj['lastBalance.balanceAmount'] = newBalanceAmountInOut;
            setObj['lastBalance.customerFee'] = doc.customerFee;
            setObj['lastBalance.ownerFee'] = doc.ownerFee;
            setObj['lastBalance.agentFee'] = doc.agentFee;
            setObj['lastBalance.balanceAmountFee'] = newBalanceAmountInOut + doc.agentFee;
            Transfer.direct.update(
                doc._id, {
                    $set: setObj
                }
            );
        } else if (prevDoc.type == doc.type && doc.type == "OUT") {
            setObj.balanceAmount = newBalanceAmountOutOut;
            setObj['lastBalance.balanceAmount'] = newBalanceAmountOutOut;
            setObj['lastBalance.customerFee'] = doc.customerFee;
            setObj['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
            setObj['lastBalance.agentFee'] = doc.feeDoc.agentFee;
            setObj['lastBalance.balanceAmountFee'] = newBalanceAmountOutOut + doc.feeDoc.agentFee;
            Transfer.direct.update(
                doc._id, {
                    $set: setObj
                }
            );

        } else if (prevDoc.type != doc.type && doc.type == "IN") {
            setObj.balanceAmount = newBalanceAmountOutIn;
            setObj['lastBalance.balanceAmount'] = newBalanceAmountOutIn;
            setObj['lastBalance.customerFee'] = doc.customerFee;
            setObj['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
            setObj['lastBalance.agentFee'] = doc.feeDoc.agentFee;
            setObj['lastBalance.balanceAmountFee'] = newBalanceAmountOutIn + doc.feeDoc.agentFee;
            Transfer.direct.update(
                doc._id, {
                    $set: setObj
                }
            );

        }
        // if (doc.type == "In") {
        //     // Transfer.update(
        //     //     doc._id,
        //     //     {
        //     //         $set: {
        //     //             lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
        //     //             lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
        //     //             lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
        //     //             lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
        //     //             lastOpeningAmountFee: doc.tmpOpeningAmountFee + totalInAmountAgentFee
        //     //         }
        //     //     }
        //     // );
        //     //update Fee in
        //     Fee.update(
        //         fee._id,
        //         {
        //             $set: {
        //                 lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
        //                 lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
        //                 lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
        //                 lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
        //                 lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.feeDoc.agentFee
        //             }
        //         }
        //     );
        // } else {
        //     //update Transfer out
        //     // Transfer.update(doc._id, {
        //     //     $set: {
        //     //         lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
        //     //         lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
        //     //         lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
        //     //         lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
        //     //         lastOpeningAmountFee: totalOutAmountAgentFee - doc.amount
        //     //     }
        //     // });
        //     //update Fee in
        //     Fee.update(
        //         fee._id,
        //         {
        //             $set: {
        //                 lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
        //                 lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
        //                 lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
        //                 lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
        //                 lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.agentFee
        //             }
        //         }
        //     );
        // }
    });
});
