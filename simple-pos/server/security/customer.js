import {Customer} from '../../imports/api/collections/customer.js';

// Lib
import './_init.js';

Customer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Customer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Customer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
