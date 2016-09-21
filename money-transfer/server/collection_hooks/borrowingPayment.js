import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {CalInterest} from '../../common/libs/calInterest';

// Collection
import {BorrowingPayment} from '../../common/collections/borrowingPayment';
import {Borrowing} from '../../common/collections/borrowing';

BorrowingPayment.before.insert(function (userId, doc) {
    let prefix = `${doc.borrowingId}-`;
    doc._id = idGenerator.genWithPrefix(BorrowingPayment, prefix, 4);

    doc.paidDoc = {
        principal: 0,
        interest: 0
    };
    doc.balanceDoc = {
        principal: doc.lastPaymentDoc.balanceDoc.principal,
        interest: 0
    };

    // Cal paid doc
    let totalInterestDue = doc.lastPaymentDoc.balanceDoc.interest + doc.dueDoc.currentInterest;
    if (doc.paidAmount > totalInterestDue) {
        doc.paidDoc.interest = totalInterestDue;
        doc.paidDoc.principal = doc.paidAmount - totalInterestDue;

        doc.balanceDoc.principal = doc.lastPaymentDoc.balanceDoc.principal - doc.paidDoc.principal;
    } else {
        doc.paidDoc.interest = totalInterestDue - doc.paidAmount;

        doc.balanceDoc.interest = doc.lastPaymentDoc.balanceDoc.principal - doc.paidDoc.interest;
    }

    // Cal status
    doc.status = 'Partial';
    if (doc.balanceDoc.principal == 0) {
        doc.status = 'Close'
    }
});

BorrowingPayment.after.insert(function (userId, doc) {
    if (doc.status == 'Close') {
        Borrowing.direct.update({_id: doc.borrowingId}, {$set: {status: 'Close', closeDate: doc.paidDate}});
    }
});