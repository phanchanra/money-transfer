import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';

// Collection
import {Customer} from '../../common/collections/customer.js';
import {senderGlobalState} from '../../common/libs/senderState'
//import {receiverGlobalState} from '../../common/libs/receiverState'
Customer.before.insert(function (userId, doc) {
    let prefix = doc.branchId + '-';
    let id = doc._id;
    doc._id = idGenerator.genWithPrefix(Customer, prefix, 6);
    senderGlobalState.set(id, doc);
    //receiverGlobalState.set(id, doc)
});
