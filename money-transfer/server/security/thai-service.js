import {ThaiService} from '../../imports/api/collections/thai-service.js';

// Lib
import './_init.js';

ThaiService.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
ThaiService.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
ThaiService.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
