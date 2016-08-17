import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {MoneyTransfer} from '../../imports/api/collections/money-transfer';
import {moneyTransferState} from '../../common/globalState/moneyTransferState';
MoneyTransfer.before.insert(function (userId, doc) {
    let tmpId = doc._id;
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(MoneyTransfer, prefix, 8);
    moneyTransferState.set(tmpId, doc);
});
