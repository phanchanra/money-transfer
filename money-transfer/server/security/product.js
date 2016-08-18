import {Product} from '../../imports/api/collections/product';

// Lib
import './_init.js';

Product.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Product.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Product.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();