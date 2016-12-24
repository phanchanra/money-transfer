import {ExchangeTransaction} from '../../common/collections/exchange-transaction';
Meteor.methods({
    lastExchangeTransactionRemoveEdit: function ({_id}) {
        let lastExchangeTransaction =  ExchangeTransaction.findOne({}, {sort: {_id: -1}});
        return _id == lastExchangeTransaction._id;
    }
});