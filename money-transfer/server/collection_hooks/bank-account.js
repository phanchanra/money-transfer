import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
//Collection
import {Transfer} from '../../imports/api/collections/transfer';
import {Fee} from '../../imports/api/collections/fee';

Transfer.before.insert(function (userId, doc) {
    let checkBalanceAmount = Transfer.findOne({
        productId: doc.productId,
        currencyId: doc.currencyId
    }, {sort: {_id: -1}});
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);

    if (doc.type == "CD") {
        if (checkBalanceAmount) {
            doc.balanceAmount = checkBalanceAmount.balanceAmount + doc.amount;
        } else {
            doc.balanceAmount = doc.amount;
        }
    } else if (doc.type == "CW") {
        if (checkBalanceAmount) {
            doc.balanceAmount = checkBalanceAmount.balanceAmount - doc.amount;
        } else {
            doc.balanceAmount = -doc.amount;
        }
    }
});

Transfer.after.insert(function (userId, doc) {
    Meteor.defer(function () {
        let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
        if (fee.productId == doc.productId && fee.currencyId == doc.currencyId) {
            if (doc.type == "CD") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: doc.balanceAmount,
                                balanceAmountFee: doc.balanceAmount
                            }
                        }
                    }
                );
            } else if (doc.type == "CW") {
                Fee.direct.update(
                    fee._id,
                    {
                        $set: {
                            os: {
                                date: new Date(),
                                balanceAmount: doc.balanceAmount,
                                balanceAmountFee: doc.balanceAmount
                            }
                        }
                    }
                );
            }
        }
    });

});

Transfer.after.update(function (userId, doc) {
    let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
    let preDoc = this.previous;
    //condition 1 CD => CD
    let resultAmountCDCD = preDoc.amount - doc.amount;
    let newBalanceAmountCDCD = preDoc.balanceAmount - resultAmountCDCD;
    //condition 2 CD => CW
    let resultAmountCDCW = preDoc.amount + doc.amount;
    let newBalanceAmountCDCW = preDoc.balanceAmount - resultAmountCDCW;
    //condition 3 CW => CW
    let resultAmountCWCW = preDoc.balanceAmount - doc.amount;
    let newBalanceAmountCWCW = preDoc.amount + resultAmountCWCW;
    //condition 4 CW => CD
    let resultAmountCWCD = preDoc.amount + preDoc.balanceAmount;
    let newBalanceAmountCWCD = resultAmountCWCD + doc.amount;

    Meteor.defer(function () {
        if (preDoc.type == doc.type && doc.type == "CD") {
            Transfer.direct.update(
                doc._id, {
                    $set: {
                        amount: doc.amount,
                        balanceAmount: newBalanceAmountCDCD
                    }
                }
            );
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: Date.now(),
                            balanceAmount: newBalanceAmountCDCD,
                            balanceAmountFee: newBalanceAmountCDCD
                        }
                    }
                }
            );
        } else if (preDoc.type != doc.type && doc.type == "CW") {
            Transfer.direct.update(
                doc._id, {
                    $set: {
                        amount: doc.amount,
                        balanceAmount: newBalanceAmountCDCW
                    }
                }
            );
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: new Date(),
                            balanceAmount: newBalanceAmountCDCW,
                            balanceAmountFee: newBalanceAmountCDCW,
                        }
                    }
                }
            );
        } else if (preDoc.type == doc.type && doc.type == "CW") {
            Transfer.direct.update(
                doc._id, {
                    $set: {
                        amount: doc.amount,
                        balanceAmount: newBalanceAmountCWCW
                    }
                }
            );
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: new Date(),
                            balanceAmount: newBalanceAmountCWCW,
                            balanceAmountFee: newBalanceAmountCWCW,
                        }
                    }
                }
            );
        } else if (preDoc.type != doc.type && doc.type == "CD") {
            Transfer.direct.update(
                doc._id, {
                    $set: {
                        amount: doc.amount,
                        balanceAmount: newBalanceAmountCWCD
                    }
                }
            );
            Fee.direct.update(
                fee._id,
                {
                    $set: {
                        os: {
                            date: new Date(),
                            balanceAmount: newBalanceAmountCWCD,
                            balanceAmountFee: newBalanceAmountCWCD,
                        }
                    }
                }
            );
        }
    });
});




