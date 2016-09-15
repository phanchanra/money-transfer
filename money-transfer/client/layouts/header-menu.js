import {Template} from 'meteor/templating';
import {TAPi18n} from 'meteor/tap:i18n';
import 'meteor/tap:i18n-ui';
import {moment} from 'meteor/momentjs:moment';
//Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
// Page
import './header-menu.html';
import {Customer} from '../../common/collections/customer';
// Declare template
let indexTmpl = Template.MoneyTransfer_headerMenu,
    ShowTmpl = Template.MoneyTransfer_customerAlertShow;
indexTmpl.created = function () {
    this.autorun(function () {
        this.subscription = Meteor.subscribe('moneyTransfer.customerExpiredDate', {limit: 100});
    });
    createNewAlertify('customerAlertShow');
};

indexTmpl.helpers({
    countExpiredDateCustomer(){
        let currentDate = moment().toDate();
        return Customer.find({expiredDate: {$lt: currentDate}}).count();
    },
    customerExpiredDate(){
        let currentDate = moment().toDate();
        return Customer.find({expiredDate: {$lt: currentDate}}, {limit: 20});
    },
    calExpiredDate(expiredDate){
        let currentDate = moment().toDate();
        return moment(currentDate).diff(expiredDate, 'days');
    }
});
indexTmpl.events({
    'click .customer-alert' (e, instance) {
        let id = $(e.currentTarget).attr('data-customerId');
        Meteor.call("getCustomer", id, function (error, result) {
            alertify.customerAlertShow(fa('eye', 'Customer'), renderTemplate(ShowTmpl, result));
        });
    },
});