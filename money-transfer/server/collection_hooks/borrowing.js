import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {CalInterest} from '../../common/libs/calInterest';

// Collection
import {Borrowing} from '../../common/collections/borrowing';

// Insert
Borrowing.before.insert(function (userId, doc) {
    let prefix = `${doc.branchId}-`;
    doc._id = idGenerator.genWithPrefix(Borrowing, prefix, 12);

    doc.borrowingDateText = moment(doc.borrowingDate).format('DD/MM/YYYY');

    doc.tenor = moment(doc.maturityDate).diff(doc.borrowingDate, 'days');
    doc.projectInterest = CalInterest({
        amount: doc.borrowingAmount,
        numOfDay: doc.tenor,
        interestRate: doc.interestRate,
        method: 'M',
        dayInMethod: 30,
        currencyId: doc.currencyId
    });

});

Borrowing.after.insert(function (userId, doc) {
    // Update type of ref borrowing
    if (doc.refId) {
        Borrowing.direct.update({_id: doc.refId}, {$set: {status: 'Reschedule', rescheduleDate: doc.borrowingDate}});
    }
});

// Update
Borrowing.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};

    if (!modifier.$set.status) {
        modifier.$set.borrowingDateText = moment(modifier.$set.borrowingDate).format('DD/MM/YYYY');

        modifier.$set.tenor = moment(modifier.$set.maturityDate).diff(modifier.$set.borrowingDate, 'days');
        modifier.$set.projectInterest = CalInterest({
            amount: modifier.$set.borrowingAmount,
            numOfDay: modifier.$set.tenor,
            interestRate: modifier.$set.interestRate,
            method: 'M',
            dayInMethod: 30,
            currencyId: modifier.$set.currencyId
        });
    }

});