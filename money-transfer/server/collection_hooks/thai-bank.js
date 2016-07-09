import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ThaiBank} from '../../imports/api/collections/thai-bank.js';

ThaiBank.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(ThaiBank, 4);
});
