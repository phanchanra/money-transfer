import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Sender} from '../../imports/api/collections/sender.js';

Sender.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(Sender, 3);
});
