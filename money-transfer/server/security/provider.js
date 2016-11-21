import {Provider} from '../../common/collections/provider';

// Lib
import '../configs/security.js';

Provider.permit(['insert'])
    .MoneyTransfer_ifDataInsert()
    .allowInClientCode();
Provider.permit(['update'])
    .MoneyTransfer_ifDataUpdate()
    .allowInClientCode();
Provider.permit(['remove'])
    .MoneyTransfer_ifDataRemove()
    .allowInClientCode();
