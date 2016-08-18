import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Fee} from '../../imports/api/collections/fee';

Fee.before.insert(function (userId, doc) {
    // let prefix = doc.productId + '-';
    doc._id = idGenerator.gen(Fee, 4);
});
