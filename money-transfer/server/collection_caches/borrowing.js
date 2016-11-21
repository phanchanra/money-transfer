import 'meteor/theara:collection-cache';

// Collection
import {Borrowing} from '../../common/collections/borrowing';
import {Customer} from '../../common/collections/customer';

// Borrowing.cacheTimestamp();
Borrowing.cacheDoc(
    'customerDoc',
    Customer,
    ['name', 'gender', 'dob','address','telephone','email'],
    'customerId'
);
