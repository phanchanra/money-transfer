import {Supplier} from '../../imports/api/collections/supplier';

// Lib
import './_init.js';

Supplier.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Supplier.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Supplier.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();