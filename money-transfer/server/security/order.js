import {Order} from '../../imports/api/collections/order.js';

// Lib
import './_init.js';

Order.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Order.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Order.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
