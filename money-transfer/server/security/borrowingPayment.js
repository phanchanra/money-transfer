import {BorrowingPayment} from '../../common/collections/borrowingPayment';

// Lib
import '../configs/security.js';

BorrowingPayment.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
BorrowingPayment.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
BorrowingPayment.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
