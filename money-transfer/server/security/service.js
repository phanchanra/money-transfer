import {Service} from '../../imports/api/collections/service';

// Lib
import './_init.js';

Service.permit(['insert'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Service.permit(['update'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();
Service.permit(['remove'])
    .MoneyTransfer_ifSetting()
    .allowInClientCode();