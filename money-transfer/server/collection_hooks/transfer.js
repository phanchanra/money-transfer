import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
import {moneyTransferState} from '../../common/libs/moneyTransferState';
Transfer.before.insert(function (userId, doc) {
    let lastBalance = {};
    //let tmpBalance = {};
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 12);
    moneyTransferState.set(tmpId, doc);
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    if (doc.transferType == 'khmer') {
        if (doc.type == "IN") {
            //check when discount only agentfee
            lastBalance.date = new Date();
            lastBalance.balanceAmount = fee.os.balanceAmount + doc.totalAmount;
            lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
            lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
            lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
            lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.totalAmount) + doc.feeDoc.agentFee;
            doc.balanceAmount = (fee.os.balanceAmountFee + doc.totalAmount) + doc.feeDoc.agentFee;
            doc.agentFee = doc.feeDoc.agentFee;//add field for Increment or Decrement
            doc.lastBalance = lastBalance;
        } else if (doc.type == "OUT") {
            //check when discount only agentfee
            lastBalance.date = new Date();
            lastBalance.balanceAmount = fee.os.balanceAmount - doc.amount;
            lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
            lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
            lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
            lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;
            doc.balanceAmount = (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;
            doc.agentFee = doc.totalFee;//add field for Increment or Decrement
            doc.lastBalance = lastBalance;
        }
    } else {
        if (doc.type == "IN") {
            //check when discount only agentfee
            let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
            let principleSubFee = doc.amount - doc.totalFee;
            lastBalance.date = new Date();
            lastBalance.balanceAmount = fee.os.balanceAmount + principleSubFee;
            lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
            lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
            lastBalance.agentFee = fee.os.agentFee == null ? doc.totalFee : fee.os.agentFee + doc.totalFee;
            lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + principleSubFee) + doc.totalFee;
            //doc.amount=principleSubFee;
            doc.balanceAmount = (fee.os.balanceAmountFee + principleSubFee) + doc.totalFee;
            doc.agentFee = agentFee;//add field for Increment or Decrement
            doc.lastBalance = lastBalance;
        } else if (doc.type == "OUT") {
            //check when discount only agentfee
            lastBalance.date = new Date();
            lastBalance.balanceAmount = fee.os.balanceAmount - doc.amount;
            lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
            lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
            lastBalance.agentFee = fee.os.agentFee == null ? doc.totalFee : fee.os.agentFee + doc.totalFee;
            lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.totalFee) - doc.amount;
            doc.balanceAmount = (fee.os.balanceAmountFee + doc.totalFee) - doc.amount;
            doc.agentFee = doc.totalFee;//add field for Increment or Decrement
            doc.lastBalance = lastBalance;
        }
    }

});
Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        //exchange transaction
        Meteor._sleepForMs(200);
        Meteor.call('updateFeeAfterInsertTransfer', {doc});
        // ExchangeTransaction.insert(
        //     {
        //         transferId: doc._id,
        //         exchangeDate: doc.transferDate,
        //         customerId: doc.senderId,
        //         branchId: doc.branchId,
        //         items: doc.items,
        //         transactionExchangeRef: "Exchange from transfer"
        //     }
        // );
    });
});
//
Transfer.before.update(function (userId, doc, fieldNames, modifier, options) {
    //modifier.$set = modifier.$set || {};
    // modifier.$set.items = doc.items;
    // if (modifier && modifier.$set && modifier.$set.doc && modifier.$set.doc.items) {
    //     let items = modifier.$set.doc.items;
    //     if (items !== doc.items) {
    //         //console.log("Updating slug for '" + modifier.$set.doc.items + "' to " + items);
    //         modifier.$set.doc.items = doc.items;
    //     }
    //     // Transfer.direct.update(
    //     //     {_id: doc._id},
    //     //     {
    //     //         $set: {items: doc.items}
    //     //     })
    // }
});
Transfer.after.update(function (userId, doc) {
    //prevDoc = this.previous;
    Meteor.defer(function () {
        Meteor._sleepForMs(200);

        Meteor.call('updateTransferFeeAfterUpdateTransfer', {doc});
        // let exchangeTransfer = ExchangeTransaction.findOne({transferId: doc._id});
        // ExchangeTransaction.direct.update(
        //     {_id: exchangeTransfer._id},
        //     {
        //         $set: {
        //             exchangeDate: doc.transferDate,
        //             customerId: doc.senderId,
        //             items: doc.items
        //         }
        //     }
        // );
    });

});

Transfer.after.remove(function (userId, doc) {
    Meteor.defer(function () {
        Meteor._sleepForMs(200);
        ExchangeTransaction.remove({_id: doc._Id});
        Meteor.call('updateFeeAfterRemoveTransferAndBankAccount', {doc});
    });
});