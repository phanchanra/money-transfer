import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {BorrowingPayment} from '../collections/borrowingPayment';

export const getLastPaymentByBorrowing = new ValidatedMethod({
    name: 'moneyTransfer.getLastPaymentByBorrowing',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        borrowingId: {type: String},
        lteDate: {type: Date, optional: true}
    }).validator(),
    run({borrowingId, lteDate}) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let selector = {};
            selector.borrowingId = borrowingId;
            if (lteDate) {
                selector.paidDate = {$lte: lteDate};
            }

            return BorrowingPayment.findOne(selector, {sort: {_id: -1}});
        }
    }
});