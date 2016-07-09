import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ThaiService} from '../../imports/api/collections/thai-service.js';

ThaiService.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(ThaiService, 3);
});
