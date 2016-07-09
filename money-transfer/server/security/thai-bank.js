import {ThaiBank} from '../../imports/api/collections/thai-bank.js';

// Lib
import './_init.js';

ThaiBank.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
ThaiBank.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
ThaiBank.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
