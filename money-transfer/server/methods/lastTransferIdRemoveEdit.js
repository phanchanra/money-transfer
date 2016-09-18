import {Transfer} from '../../common/collections/transfer';
Meteor.methods({
    lastTransferIdRemoveEdit: function ({_id, productId, currencyId}) {
        let lastTransfer =  Transfer.findOne({productId: productId, currencyId: currencyId}, {sort: {_id: -1}});
        return _id == lastTransfer._id;
    }
});