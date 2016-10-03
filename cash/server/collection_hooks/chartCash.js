import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {ChartCash} from '../../common/collections/chartCash.js';

ChartCash.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(ChartCash, 4);
});
