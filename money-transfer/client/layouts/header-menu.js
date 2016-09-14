import {Template} from 'meteor/templating';
import {TAPi18n} from 'meteor/tap:i18n';
import 'meteor/tap:i18n-ui';
import {moment} from 'meteor/momentjs:moment';

// Page
import './header-menu.html';
import {Customer} from '../../common/collections/customer';
// Declare template
let indexTmpl = Template.MoneyTransfer_headerMenu;

indexTmpl.created = function () {
    this.autorun(function () {
        this.subscription = Meteor.subscribe('moneyTransfer.customerExpiredDate', {limit: 100});
    })
};

indexTmpl.helpers({
    countExpiredDateCustomer(){
        return Customer.find().count();
    },
    customerExpiredDate(){
        return Customer.find({}, {limit: 20});
    },
    calExpiredDate(expiredDate){
        let currentDate = moment().toDate();
        return moment(currentDate).diff(expiredDate, 'days');
    }
});