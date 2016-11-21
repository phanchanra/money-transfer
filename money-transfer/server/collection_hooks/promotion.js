import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
// Collection
import {Promotion} from '../../common/collections/promotion';

Promotion.before.insert(function (userId, doc) {
    //let prefix = doc.branchId + '-';
    doc._id = idGenerator.gen(Promotion, 4);
});
