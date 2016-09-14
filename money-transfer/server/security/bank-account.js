import {Transfer} from '../../common/collections/transfer.js';

// Lib
import '../configs/security.js';

Transfer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Transfer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Transfer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
