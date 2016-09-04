import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../imports/api/collections/transfer';
import {Fee} from '../../imports/api/collections/fee';
import {moneyTransferState} from '../../common/globalState/moneyTransferState';
Transfer.before.insert(function (userId, doc) {
    //console.log(doc.type);
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);
    moneyTransferState.set(tmpId, doc);

    //let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    //let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee == null ? 0 : doc.feeDoc.agentFee;
    //let totalOutAmountAgentFee = fee.os.openingAmountFee + doc.feeDoc.agentFee == null ? 0 : doc.feeDoc.agentFee;
    // if (doc.type == "IN") {
    //     doc.openingAmount = fee.os.openingAmount + doc.amount;
    //     doc.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
    //     doc.ownerFee = fee.os.wnerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
    //     doc.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
    //     doc.openingAmountFee = (fee.os.openingAmountFee + doc.amount) + doc.feeDoc.agentFee;
    // } else {
    //     doc.openingAmount = fee.os.openingAmount - doc.amount;
    //     doc.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
    //     doc.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
    //     doc.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
    //     doc.openingAmountFee = (doc.openingAmount - doc.amount) - doc.feeDoc.agentFee;
    // }
    //temporary balance
    // doc.tempBalance = {
    //     fromAmount: doc.feeDoc.fromAmount,
    //     toAmount: doc.feeDoc.toAmount,
    //     customerFee: doc.feeDoc.customerFee,
    //     ownerFee: doc.feeDoc.ownerFee,
    //     agentFee: doc.feeDoc.agentFee
    // };

    //doc.tmpOpeningAmount = fee.os.openingAmountfee = fee.os.openingAmount == null ? 0 : fee.os.openingAmount;
    //doc.tmpCustomerFee = fee.os.customerFee = fee.os.customerFee == null ? 0 : fee.os.customerFee;
    //doc.tmpOwnerFee = fee.os.ownerFee = fee.os.ownerFee == null ? 0 : fee.os.ownerFee;
    //doc.tmpAgentFee = fee.lastAgentFee = fee.lastAgentFee == null ? 0 : fee.os.agentFee;
    //doc.tmpOpeningAmountFee = fee.os.openingAmountFee;
    //tmp:{fromAmount: this.fromAmount, toAmount:this.toAmount, customerFee:this.customerFee, ownerFee:this.ownerFee, agentFee:this.agentFee}
    // let tempOpeningAmount = fee.os.openingAmountfee = fee.os.openingAmount == null ? 0 : fee.os.openingAmount;
    // let tempCustomerFee = fee.os.customerFee = fee.os.customerFee == null ? 0 : fee.os.customerFee;
    // let tempOwnerFee = fee.os.ownerFee = fee.os.ownerFee == null ? 0 : fee.os.ownerFee;
    // let tempAgentFee = fee.lastAgentFee = fee.lastAgentFee == null ? 0 : fee.os.agentFee;
    // let tempOpeningAmountFee = fee.os.openingAmountFee;

    // doc.tmpBalance({
    //     tmpOpeningAmount:tempOpeningAmount,
    //     tmpCustomerFee:tempCustomerFee,
    //     tmpOwnerFee:tempOwnerFee,
    //     tmpAgentFee:tempAgentFee,
    //     tmpOpeningAmountFee:tempOpeningAmountFee
    // });

});

Transfer.after.insert(function (userId, doc) {
    // Meteor.defer(function () {
    //     let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    //     //let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
    //     //let totalOutAmountAgentFee = fee.lastOpeningAmountFee + doc.feeDoc.agentFee;
    //     console.log(doc);
    //     if (doc.type == "IN") {
    //         Fee.update(
    //             fee._id,
    //             {
    //                 $set: {
    //
    //                     os: {
    //                         openingBalance: fee.os.openingBalance + doc.balanceAmount,
    //                         customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
    //                         ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
    //                         agentFee: fee.os.agentFee == null ? doc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
    //                         balanceAmountFee: fee.os.openingBalance + doc.feeDoc.agentFee
    //                     }
    //                 }
    //             }
    //         );
    //     } else {
    //         Fee.update(
    //             fee._id,
    //             {
    //                 $set: {
    //                     os: {
    //                         openingBalance: fee.os.openingBalance - doc.balanceAmount,
    //                         customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
    //                         ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
    //                         agentFee: fee.os.agentFee == null ? doc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
    //                         balanceAmountFee: (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount
    //                     }
    //                 }
    //             }
    //         )
    //     }
    //
    // });
});
//
Transfer.after.update(function (userId, doc) {
    // Meteor.defer(function () {
    //     let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    //     let totalInAmountAgentFee = doc.amount + doc.feeDoc.agentFee;
    //     let totalOutAmountAgentFee = doc.tmpOpeningAmountFee + doc.feeDoc.agentFee;
    //     // console.log(doc.transferType);
    //     // console.log(doc.feeDoc.totalAmount);
    //     console.log(doc);
    //     if (doc.type == "In") {
    //         // Transfer.update(
    //         //     doc._id,
    //         //     {
    //         //         $set: {
    //         //             lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
    //         //             lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
    //         //             lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
    //         //             lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
    //         //             lastOpeningAmountFee: doc.tmpOpeningAmountFee + totalInAmountAgentFee
    //         //         }
    //         //     }
    //         // );
    //         //update Fee in
    //         Fee.update(
    //             fee._id,
    //             {
    //                 $set: {
    //                     lastOpeningAmount: doc.tmpOpeningAmount + doc.amount,
    //                     lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
    //                     lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
    //                     lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
    //                     lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.feeDoc.agentFee
    //                 }
    //             }
    //         );
    //     } else {
    //         //update Transfer out
    //         // Transfer.update(doc._id, {
    //         //     $set: {
    //         //         lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
    //         //         lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
    //         //         lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
    //         //         lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
    //         //         lastOpeningAmountFee: totalOutAmountAgentFee - doc.amount
    //         //     }
    //         // });
    //         //update Fee in
    //         Fee.update(
    //             fee._id,
    //             {
    //                 $set: {
    //                     lastOpeningAmount: doc.tmpOpeningAmount - doc.amount,
    //                     lastCustomerFee: doc.tmpCustomerFee + doc.customerFee,
    //                     lastOwnerFee: doc.tmpOwnerFee + doc.feeDoc.ownerFee,
    //                     lastAgentFee: doc.tmpAgentFee + doc.feeDoc.agentFee,
    //                     lastOpeningAmountFee: doc.tmpOpeningAmountFee + doc.agentFee
    //                 }
    //             }
    //         );
    //     }
    // });
});
