import {Sender} from '../../imports/api/collections/sender.js';

// Lib
import './_init.js';

Sender.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Sender.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Sender.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
