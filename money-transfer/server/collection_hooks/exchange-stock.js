import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
// Collection
import {ExchangeStock} from '../../common/collections/exchange-stock';

ExchangeStock.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(ExchangeStock, prefix, 12);
});

