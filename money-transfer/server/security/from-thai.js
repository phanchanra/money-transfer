import {FromThai} from '../../imports/api/collections/from-thai.js';

// Lib
import './_init.js';

FromThai.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
FromThai.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
FromThai.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
