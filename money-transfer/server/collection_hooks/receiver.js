import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Receiver} from '../../imports/api/collections/receiver.js';

Receiver.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(Receiver, 3);
});
