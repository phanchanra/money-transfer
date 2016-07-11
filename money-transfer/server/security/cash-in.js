import {CashIn} from '../../imports/api/collections/cash-in.js';

// Lib
import './_init.js';

CashIn.permit(['insert', 'update', 'remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
