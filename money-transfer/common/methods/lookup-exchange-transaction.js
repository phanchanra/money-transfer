import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {ExchangeTransaction} from '../collections/exchange-transaction';

export const lookupExchangeTransaction = new ValidatedMethod({
    name: 'moneyTransfer.lookupExchangeTransaction',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        exchangeTransactionId: {type: String}
    }).validator(),
    run({exchangeTransactionId}) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);
            let data = ExchangeTransaction.aggregate([
                {
                    $match: {_id: exchangeTransactionId}
                },
                {
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {
                    $unwind: "$customerDoc"
                },
                {
                    $unwind: "$items"
                },
                // {
                //     $lookup: {
                //         from: "simplePos_item",
                //         localField: "items.itemId",
                //         foreignField: "_id",
                //         as: "itemDoc"
                //     }
                // },
                // {
                //     $unwind: "$itemDoc"
                // },
                {
                    $project: {
                        _id: 1,
                        exchangeDate: 1,
                        customerId: 1,
                        customerDoc: 1,
                        //des: 1,
                        branchId: 1,
                        items: 1,
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        exchangeDate: {$last: "$exchangeDate"},
                        customerId: {$last: "$customerId"},
                        customerDoc: {$last: "$customerDoc"},
                        //des: {$last: "$des"},
                        branchId: {$last: "$branchId"},
                        //total: {$last: "$total"},
                        items: {
                            $addToSet: {
                                baseCurrency: "$items.baseCurrency",
                                buying: "$items.buying",
                                selling: "$items.selling",
                                convertTo: "$items.convertTo",
                                baseAmount: "$items.baseAmount",
                                toAmountBuying: "$items.toAmountBuying",
                                toAmount: "$items.toAmount",
                                income: "$items.income"
                            }
                        }
                    }
                }
            ]);

            return data[0];
        }
    }
});