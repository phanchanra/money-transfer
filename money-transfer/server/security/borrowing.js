import {Borrowing} from '../../common/collections/borrowing';

// Lib
import '../configs/security.js';

Borrowing.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Borrowing.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Borrowing.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
