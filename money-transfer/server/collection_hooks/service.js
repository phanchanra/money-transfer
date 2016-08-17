import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Service} from '../../imports/api/collections/service';

Service.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(Service, 3);
});
