import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../imports/api/collections/transfer';
import {Fee} from '../../imports/api/collections/fee';
import {moneyTransferState} from '../../common/globalState/moneyTransferState';
Transfer.before.insert(function (userId, doc) {
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
    let totalOutAmountAgentFee = fee.lastOpeningAmountFee + doc.feeDoc.agentFee;
    if (doc.transferType == "In") {
        doc.lastOpeningAmount = fee.lastOpeningAmount + doc.amount;
        doc.lastCustomerFee = fee.lastCustomerFee == null ? doc.customerFee : fee.lastCustomerFee + doc.customerFee;
        doc.lastOwnerFee = fee.lastOwnerFee == null ? doc.feeDoc.ownerFee : fee.lastOwnerFee + doc.feeDoc.ownerFee;
        doc.lastAgentFee = fee.lastAgentFee == null ? doc.feeDoc.agentFee : fee.lastAgentFee + doc.feeDoc.agentFee;
        doc.lastOpeningAmountFee = fee.lastOpeningAmountFee + totalInAmountAgentFee;
    } else {
        doc.lastOpeningAmount = fee.lastOpeningAmount - doc.amount;
        doc.lastCustomerFee = fee.lastCustomerFee == null ? doc.customerFee : fee.lastCustomerFee + doc.customerFee;
        doc.lastOwnerFee = fee.lastOwnerFee == null ? doc.feeDoc.ownerFee : fee.lastOwnerFee + doc.feeDoc.ownerFee;
        doc.lastAgentFee = fee.lastAgentFee == null ? doc.feeDoc.agentFee : fee.lastAgentFee + doc.feeDoc.agentFee;
        doc.lastOpeningAmountFee = totalOutAmountAgentFee - doc.amount;
    }
    //temporary balance
    doc.tmpOpeningAmount = fee.lastOpeningAmountfee = fee.lastOpeningAmount == null ? 0 : fee.lastOpeningAmount;
    doc.tmpCustomerFee = fee.lastCustomerFee = fee.lastCustomerFee == null ? 0 : fee.lastCustomerFee;
    doc.tmpOwnerFee = fee.lastOwnerFee = fee.lastOwnerFee == null ? 0 : fee.lastOwnerFee;
    doc.tmpAgentFee = fee.lastAgentFee = fee.lastAgentFee == null ? 0 : fee.lastAgentFee;
    doc.tmpOpeningAmountFee = fee.lastOpeningAmountFee;

    moneyTransferState.set(tmpId, doc);
});

Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
        let totalOutAmountAgentFee = fee.lastOpeningAmountFee + doc.feeDoc.agentFee;
        if (doc.transferType == "In") {
            Fee.update(
                fee._id,
                {
                    $set: {
                        lastOpeningAmount: fee.lastOpeningAmount + doc.amount,
                        lastCustomerFee: fee.lastCustomerFee == null ? doc.customerFee : fee.lastCustomerFee + doc.customerFee,
                        lastOwnerFee: fee.lastOwnerFee == null ? doc.feeDoc.ownerFee : fee.lastOwnerFee + doc.feeDoc.ownerFee,
                        lastAgentFee: fee.lastAgentFee == null ? doc.feeDoc.agentFee : fee.lastAgentFee + doc.feeDoc.agentFee,
                        lastOpeningAmountFee: fee.lastOpeningAmountFee + totalInAmountAgentFee
                    }
                }
            );
        } else {
            Fee.update(
                fee._id,
                {
                    $set: {
                        lastOpeningAmount: fee.lastOpeningAmount - doc.amount,
                        lastCustomerFee: fee.lastCustomerFee == null ? doc.customerFee : fee.lastCustomerFee + doc.customerFee,
                        lastOwnerFee: fee.lastOwnerFee == null ? doc.feeDoc.ownerFee : fee.lastOwnerFee + doc.feeDoc.ownerFee,
                        lastAgentFee: fee.lastAgentFee == null ? doc.feeDoc.agentFee : fee.lastAgentFee + doc.feeDoc.agentFee,
                        lastOpeningAmountFee: totalOutAmountAgentFee - doc.amount
                    }
                }
            )
        }

    });
});
//
Transfer.after.update(function (userId, doc) {
    Meteor.defer(function () {
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
        let totalOutAmountAgentFee = doc.tmpOpeningAmountFee + doc.feeDoc.agentFee;
        // console.log(doc.transferType);
        // console.log(doc.feeDoc.totalAmount);
        console.log(doc);
        if (doc.transferType == "In") {
            // Transfer.update(
            //     doc._id,
            //     {
            //         $set: {
            //             lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
            //             lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
            //             lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
            //             lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
            //             lastOpeningAmountFee: doc.tmpOpeningAmountFee + totalInAmountAgentFee
            //         }
            //     }
            // );
            //update Fee in
            Fee.update(
                fee._id,
                {
                    $set: {
                        lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
                        lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
                        lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
                        lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
                        lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.feeDoc.agentFee
                    }
                }
            );
        } else {
            //update Transfer out
            // Transfer.update(doc._id, {
            //     $set: {
            //         lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
            //         lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
            //         lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
            //         lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
            //         lastOpeningAmountFee: totalOutAmountAgentFee - doc.amount
            //     }
            // });
            //update Fee in
            Fee.update(
                fee._id,
                {
                    $set: {
                        lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
                        lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
                        lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
                        lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
                        lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.agentFee
                    }
                }
            );
        }
    });
});
