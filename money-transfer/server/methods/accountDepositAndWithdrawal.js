import {Transfer} from '../../common/collections/transfer';
Meteor.methods({
    getAccountDepositAndWithdrawal(selector){
        let obj = {
            CD: {
                count: 0
            },
            CW: {
                count: 0
            }
        };
        let transfer = Transfer.aggregate([
            {$match: {productId: selector.productId, currencyId: selector.currencyId, type: {$in: ['CD', 'CW']}}},
            {
                $group: {
                    _id: '$type',
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);
        if (transfer.length > 0) {
            transfer.forEach(function (doc) {
                obj[doc._id].count += doc.count
            });
        }
        //console.log(obj);
        return {cd: obj.CD.count, cw: obj.CW.count};
    }
});