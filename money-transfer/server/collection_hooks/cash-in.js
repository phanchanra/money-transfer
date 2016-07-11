import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {CashIn} from '../../imports/api/collections/cash-in.js';

CashIn.before.insert(function (userId, doc) {
    let prefix = doc.branchId + '-';
    doc._id = idGenerator.gen(CashIn, prefix, 6);
});
