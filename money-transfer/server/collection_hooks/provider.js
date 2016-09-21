import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
// Collection
import {Provider} from '../../common/collections/provider';

Provider.before.insert(function (userId, doc) {
    //let prefix = doc.branchId + '-';
    doc._id = idGenerator.gen(Provider, 2);
});
