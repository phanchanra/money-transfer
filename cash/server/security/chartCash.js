import {ChartCash} from '../../common/collections/chartCash.js';

// Config
import '../configs/security.js';

ChartCash.permit(['insert', 'update', 'remove'])
    .Cash_ifSetting()
    .allowInClientCode();
