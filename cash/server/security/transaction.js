import {Transaction} from '../../common/collections/transaction.js';

// Config
import '../configs/security.js';

Transaction.permit(['insert'])
    .Cash_ifDataInsert()
    .allowInClientCode();
Transaction.permit(['update'])
    .Cash_ifDataUpdate()
    .allowInClientCode();
Transaction.permit(['remove'])
    .Cash_ifDataRemove()
    .allowInClientCode();
