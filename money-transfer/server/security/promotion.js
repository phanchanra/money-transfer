import {Promotion} from '../../common/collections/promotion.js';

// Lib
import '../configs/security.js';

Promotion.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Promotion.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Promotion.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
