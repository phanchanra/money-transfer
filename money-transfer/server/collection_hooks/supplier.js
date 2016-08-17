import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
// Collection
import {Supplier} from '../../imports/api/collections/supplier';

Supplier.before.insert(function (userId, doc) {
    //let prefix = doc.branchId + '-';
    doc._id = idGenerator.gen(Supplier, 6);
});
