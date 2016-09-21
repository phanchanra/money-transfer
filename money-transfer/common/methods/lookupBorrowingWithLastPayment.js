import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {Borrowing} from '../collections/borrowing';

export const lookupBorrowingWithLastPayment = new ValidatedMethod({
    name: 'moneyTransfer.lookupBorrowingWithLastPayment',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        borrowingId: {type: String}
    }).validator(),
    run({borrowingId}) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let data = Borrowing.aggregate([
                {
                    $match: {_id: borrowingId}
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
                    $lookup: {
                        from: "moneyTransfer_borrowingPay",
                        localField: "_id",
                        foreignField: "borrowingId",
                        as: "lastPaymentDoc"
                    }
                },
                {
                    $unwind: {path: "$lastPaymentDoc", preserveNullAndEmptyArrays: true}
                },
                {
                    $sort: {"lastPaymentDoc.paidDate": 1}
                },
                {
                    $group: {
                        _id: "$_id",
                        data: {$last: "$$ROOT"},
                    }
                }

            ])[0].data;

            // Check last payment exist
            if (!data.lastPaymentDoc) {
                data.lastPaymentDoc = {
                    paidDate: data.borrowingDate,
                    dueDoc: {
                        numOfDay: 0,
                        currentInterest: 0,
                        totalAmount: data.borrowingAmount,
                    },
                    paidAmount: 0,
                    paidDoc: {
                        principal: 0,
                        interest: 0,
                    },
                    balanceDoc: {
                        principal: data.borrowingAmount,
                        interest: 0
                    }
                };
            } else {
                data.lastPaymentDoc = _.pick(data.lastPaymentDoc, ['paidDate', 'dueDoc', 'paidAmount', 'paidDoc', 'balanceDoc']);
            }

            return data;
        }
    }
});