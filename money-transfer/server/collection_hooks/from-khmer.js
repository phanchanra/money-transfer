import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {FromKhmer} from '../../imports/api/collections/from-khmer.js';

FromKhmer.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(FromKhmer, 3);
});
