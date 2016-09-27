import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
import {ExchangeStock} from '../../common/collections/exchange-stock';

ExchangeTransaction.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.genWithPrefix(ExchangeTransaction, prefix, 8);
});
ExchangeTransaction.after.insert(function (userId, doc) {
    let prefix = doc.branchId + '-';
    doc.convertCurrency.forEach(function (obj) {
        doc._id = idGenerator.genWithPrefix(ExchangeStock, prefix, 12);
        let data = {};
        data._id = doc._id;
        data.currency = obj.convertTo;
        data.exchangeDate = doc.exchangeDate;
        data.status = "IN";
        data.amount = obj.convertAmount;
        data.balanceAmount = obj.convertAmount;
        ExchangeStock.insert(data);
    });
});
