import {Item} from '../../imports/api/collections/item.js';

// Lib
import './_init.js';

Item.permit(['insert', 'update', 'remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
