import {Fee} from '../../common/collections/fee';
import {Transfer} from '../../common/collections/transfer';
//import {Currency} from '../../../core/common/collections/';
Meteor.methods({
    countDepositWith: function (productId, currencyId) {
        let depositWith = Transfer.find({productId: productId, currencyId: currencyId});
        return depositWith.count();
    }
});