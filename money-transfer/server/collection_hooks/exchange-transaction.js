import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';

ExchangeTransaction.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(ExchangeTransaction, prefix, 8);
});
