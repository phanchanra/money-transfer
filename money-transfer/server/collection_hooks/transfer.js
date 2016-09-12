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
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        if (doc.type == "IN") {
            //check when discount fee
            //let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
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
                            balanceAmountFee: (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee
                        }
                    }
                }
            );
        } else if (doc.type == "OUT") {
            //check when discount fee
            //let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: new Date(),
                            balanceAmount: fee.os.balanceAmount - doc.amount,
                            customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                            ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                            agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
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
    });
});