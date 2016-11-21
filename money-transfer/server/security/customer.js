import {Customer} from '../../common/collections/customer.js';

// Lib
import '../configs/security.js';

Customer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Customer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Customer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
