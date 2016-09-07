import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Transfer} from '../../imports/api/collections/transfer';
import {Fee} from '../../imports/api/collections/fee';
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
        //check when discount fee
        let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
        lastBalance.balanceAmount = fee.os.balanceAmount + doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + doc.amount) + agentFee;
        doc.balanceAmount = (fee.os.balanceAmountFee + doc.amount) + agentFee;
        doc.lastBalance = lastBalance;
    } else if (doc.type == "OUT") {
        //check when discount fee
        let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
        lastBalance.balanceAmount = fee.os.balanceAmount - doc.amount;
        lastBalance.customerFee = fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee;
        lastBalance.ownerFee = fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee;
        lastBalance.agentFee = fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee;
        lastBalance.balanceAmountFee = (fee.os.balanceAmountFee + agentFee) - doc.amount;
        doc.balanceAmount = (fee.os.balanceAmountFee + agentFee) - doc.amount;
        doc.lastBalance = lastBalance;
    }
});
Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        if (doc.type == "IN") {
            //check when discount fee
            let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: doc.transferDate,
                            balanceAmount: fee.os.balanceAmount + doc.amount,
                            customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                            ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                            agentFee: fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee,
                            balanceAmountFee: (fee.os.balanceAmountFee + doc.amount) + agentFee
                        }
                    }
                }
            );
        } else if (doc.type == "OUT") {
            //check when discount fee
            let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: doc.transferDate,
                            balanceAmount: fee.os.balanceAmount - doc.amount,
                            customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                            ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                            agentFee: fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee,
                            balanceAmountFee: (fee.os.balanceAmountFee + agentFee) - doc.amount
                        }
                    }
                }
            )
        }

    });
});
//
Transfer.after.update(function (userId, doc) {
    prevDoc = this.previous;
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
                    let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = balanceAmount + agentFee;
                    //update transfer
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //update balance fee
                    setObjFee['os.balanceAmount'] = balanceAmountFee;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmount + agentFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                } else {
                    //for update Transfer
                    let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmount = transferUpdate.balanceAmount + doc.amount;
                    let balanceAmountFee = transferUpdate.lastBalance.balanceAmountFee + (doc.amount + agentFee);
                    let customerFee = transferUpdate.customerFee + doc.customerFee;
                    let ownerFee = transferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;

                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = transferUpdate.lastBalance.agentFee + agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = customerFee;
                    setObjFee['os.ownerFee'] = ownerFee;
                    setObjFee['os.agentFee'] = transferUpdate.lastBalance.agentFee + agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }
            } else if (doc.type == "OUT") {
                //check undefined
                if (transferUpdate.lastBalance == null || transferUpdate.lastBalance == "undefined") {
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmountFee = balanceAmount + agentFee;
                    //update transfer
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = doc.customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id, {
                            $set: setObjTransfer
                        }
                    );
                    //for update balance Fee
                    //let balanceAmount = balanceAmount;
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = doc.customerFee;
                    setObjFee['os.ownerFee'] = doc.feeDoc.ownerFee;
                    setObjFee['os.agentFee'] = agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                } else {
                    //update Transfer
                    let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
                    let balanceAmount = transferUpdate.balanceAmount - doc.amount;
                    let customerFee = transferUpdate.customerFee + doc.customerFee;
                    let ownerFee = transferUpdate.lastBalance.ownerFee + doc.feeDoc.ownerFee;
                    let balanceAmountFee = (transferUpdate.lastBalance.balanceAmountFee + agentFee) - doc.amount;
                    console.log(balanceAmount);
                    setObjTransfer.balanceAmount = balanceAmountFee;
                    setObjTransfer['lastBalance.balanceAmount'] = balanceAmount;
                    setObjTransfer['lastBalance.customerFee'] = customerFee;
                    setObjTransfer['lastBalance.ownerFee'] = ownerFee;
                    setObjTransfer['lastBalance.agentFee'] = transferUpdate.lastBalance.agentFee + agentFee;
                    setObjTransfer['lastBalance.balanceAmountFee'] = balanceAmountFee;
                    Transfer.direct.update(
                        doc._id,
                        {
                            $set: setObjTransfer

                        }
                    );
                    //update fee balance
                    setObjFee['os.balanceAmount'] = balanceAmount;
                    setObjFee['os.customerFee'] = customerFee;
                    setObjFee['os.ownerFee'] = ownerFee;
                    setObjFee['os.agentFee'] = transferUpdate.lastBalance.agentFee + agentFee;
                    setObjFee['os.balanceAmountFee'] = balanceAmountFee;
                    Fee.direct.update(
                        feeUpdate._id,
                        {
                            $set: setObjFee
                        }
                    )
                }

            }

        }
    );
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
        } else {
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
    });
});