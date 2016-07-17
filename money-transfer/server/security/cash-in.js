import {CashIn} from '../../imports/api/collections/cash-in.js';

// Lib
import './_init.js';

CashIn.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
CashIn.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
CashIn.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();