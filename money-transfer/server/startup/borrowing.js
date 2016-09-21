import {Meteor} from 'meteor/meteor';
import {Borrowing} from '../../common/collections/borrowing';

Meteor.startup(function () {
    Borrowing._ensureIndex({borrowingDateText: 'text'});
});
