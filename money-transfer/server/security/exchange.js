import {Exchange} from '../../imports/api/collections/exchange.js';

// Lib
import './_init.js';

Exchange.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Exchange.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Exchange.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();