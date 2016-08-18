import {Fee} from '../../imports/api/collections/fee';

// Lib
import './_init.js';

Fee.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Fee.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Fee.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();