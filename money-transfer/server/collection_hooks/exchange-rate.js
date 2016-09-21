import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ExchangeRate} from '../../common/collections/exchange-rate';

ExchangeRate.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    doc._id = idGenerator.gen(ExchangeRate, 4);

});
