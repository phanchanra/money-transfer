import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {Transaction} from '../collections/transaction';

export const lookupTransaction = new ValidatedMethod({
    name: 'cash.lookupTransaction',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        transactionId: {type: String}
    }).validator(),
    run({transactionId}) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let data = Transaction.aggregate([
                {
                    $match: {_id: transactionId}
                },
                {
                    $unwind: "$items"
                },
                {
                    $lookup: {
                        from: "cash_chart",
                        localField: "items.chartCashId",
                        foreignField: "_id",
                        as: "itemDoc"
                    }
                },
                {
                    $unwind: "$itemDoc"
                },
                {
                    $project: {
                        _id: 1,
                        transactionDate: 1,
                        cashType: 1,
                        currencyId: 1,
                        voucherId: 1,
                        des: 1,
                        branchId: 1,
                        totalAmount: 1,
                        items: 1,
                        itemsDoc: 1,
                        chartCashLabel: {$concat: ["$itemDoc._id", " : ", "$itemDoc.name"]}
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        transactionDate: {$last: "$transactionDate"},
                        cashType: {$last: "$cashType"},
                        currencyId: {$last: "$currencyId"},
                        voucherId: {$last: "$voucherId"},
                        des: {$last: "$des"},
                        branchId: {$last: "$branchId"},
                        totalAmount: {$last: "$totalAmount"},
                        items: {
                            $addToSet: {
                                _id: "$items.chartCashId",
                                chartCashId: "$items.chartCashId",
                                chartCashLabel: "$chartCashLabel",
                                amount: "$items.amount"
                            }
                        }
                    }
                }
            ]);

            return data[0];
        }
    }
});