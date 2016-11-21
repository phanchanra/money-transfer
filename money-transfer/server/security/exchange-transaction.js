import {ExchangeTransaction} from '../../common/collections/exchange-transaction';

// Lib
import '../configs/security.js';

ExchangeTransaction.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
ExchangeTransaction.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
ExchangeTransaction.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();