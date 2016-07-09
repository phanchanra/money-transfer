import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {FromThai} from '../../imports/api/collections/from-thai.js';

FromThai.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(FromThai, 3);
});
