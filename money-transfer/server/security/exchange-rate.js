import {ExchangeRate} from '../../common/collections/exchange-rate';

// Lib
import '../configs/security.js';

ExchangeRate.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
ExchangeRate.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
ExchangeRate.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();