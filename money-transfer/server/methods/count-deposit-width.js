import {Fee} from '../../imports/api/collections/fee';
import {Transfer} from '../../imports/api/collections/transfer';
//import {Currency} from '../../../core/imports/api/collections/';
Meteor.methods({
    countDepositWith: function (productId, currencyId) {
        let depositWith = Transfer.find({productId: productId, currencyId: currencyId}).count();
        if (depositWith) {
            return depositWith;
        } else {
            return 0;
        }
    }
});