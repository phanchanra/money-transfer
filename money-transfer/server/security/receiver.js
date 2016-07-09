import {Receiver} from '../../imports/api/collections/receiver.js';

// Lib
import './_init.js';

Receiver.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Receiver.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Receiver.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
