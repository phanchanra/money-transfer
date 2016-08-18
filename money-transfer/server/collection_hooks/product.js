import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
// Collection
import {Product} from '../../imports/api/collections/product';

Product.before.insert(function (userId, doc) {
    //let prefix = doc.branchId + '-';
    doc._id = idGenerator.gen(Product, 2);
});
