import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
Meteor.methods({
    checkTransferIdExchangeTransaction: function (id) {
        let checkTransfer = ExchangeTransaction.findOne({_id: id});
        if (checkTransfer.transferId) {
            return checkTransfer.transferId;
        }
    }
});