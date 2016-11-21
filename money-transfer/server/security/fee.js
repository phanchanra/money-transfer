import {Fee} from '../../common/collections/fee';

// Lib
import '../configs/security.js';

Fee.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Fee.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Fee.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();