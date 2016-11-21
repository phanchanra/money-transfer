import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
//Collection
import {Transfer} from '../../common/collections/transfer';
//import {Fee} from '../../common/collections/fee';
//import {Customer} from '../../common/collections/customer';
Transfer.before.insert(function (userId, doc) {
    let checkBalanceAmount = Transfer.findOne({
        productId: doc.productId,
        currencyId: doc.currencyId
    }, {sort: {_id: -1}});
    // let prefix = doc.branchId + '-';
    // doc._id = idGenerator.genWithPrefix(Transfer, prefix, 8);

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
        Meteor.call('updateFeeAfterInsertBankAccount', {doc});
    });
});

Transfer.after.update(function (userId, doc) {
    let preDoc = this.previous;
    Meteor.call('updateBankAccountFeeAfterUpdate', {doc, preDoc})
});



