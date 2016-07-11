import {FromKhmer} from '../../imports/api/collections/from-khmer.js';

// Lib
import './_init.js';

FromKhmer.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
FromKhmer.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
FromKhmer.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
