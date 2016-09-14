import 'meteor/matb33:collection-hooks';
import {idGenerator} from 'meteor/theara:id-generator';
import {moment} from 'meteor/momentjs:moment';

// Lib
import {CalInterest} from '../../common/libs/calInterest';

// Collection
import {Borrowing} from '../../common/collections/borrowing';

Borrowing.before.insert(function (userId, doc) {
    let prefix = `${doc.branchId}-`;
    doc._id = idGenerator.genWithPrefix(Borrowing, prefix, 12);

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
