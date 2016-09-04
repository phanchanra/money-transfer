import {Transfer} from '../../imports/api/collections/transfer.js';

// Lib
import './_init.js';

Transfer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Transfer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Transfer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
