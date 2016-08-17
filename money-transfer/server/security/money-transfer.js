import {MoneyTransfer} from '../../imports/api/collections/money-transfer.js';

// Lib
import './_init.js';

MoneyTransfer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
MoneyTransfer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
MoneyTransfer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
