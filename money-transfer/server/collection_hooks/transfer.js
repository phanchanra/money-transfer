import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
import {moneyTransferState} from '../../common/globalState/moneyTransferState';
Transfer.before.insert(function (userId, doc) {
    let lastBalance = {};
    //let tmpBalance = {};
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);
    moneyTransferState.set(tmpId, doc);
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    if (doc.type == "IN") {
        //check when discount only agentfee
        let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
        lastBalance.date = new Date();
        lastBalance.balanceAmount = fee.os.balanceAmount + doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee;

        doc.balanceAmount = (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee;
        doc.agentFee = agentFee;//add field for Increment or Decrement
        doc.lastBalance = lastBalance;
    } else if (doc.type == "OUT") {
        //check when discount only agentfee
        let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
        lastBalance.date = new Date();
        lastBalance.balanceAmount = fee.os.balanceAmount - doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;

        doc.balanceAmount = (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount;
        doc.agentFee = agentFee;//add field for Increment or Decrement
        doc.lastBalance = lastBalance;
    }
});
Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        Meteor.call('updateFeeAfterInsertTransfer', {doc})
    });
});
//
Transfer.after.update(function (userId, doc) {
    //prevDoc = this.previous;
    Meteor.call('updateTransferFeeAfterUpdateTransfer', {doc})
});
Transfer.after.remove(function (userId, doc) {
    let feeUpdateOnTransfer = {};
    let transferOnTransfer = Transfer.findOne({
        productId: doc.productId,
        currencyId: doc.currencyId,
        _id: {$ne: doc._id}
    }, {sort: {_id: -1}});
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId}, {sort: {_id: -1}});

    Meteor.defer(function () {
        if (transferOnTransfer == null || transferOnTransfer == "undefined") {
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            balanceAmount: 0,
                            balanceAmountFee: 0
                        }
                    }
                }
            );
            Meteor.call('updateCustomerExpireDayAfterRemove', {doc});
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
            Meteor.call('updateCustomerExpireDayAfterRemove', {doc});
        }
    });
});