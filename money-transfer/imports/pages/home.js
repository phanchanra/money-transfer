import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {TAPi18n} from 'meteor/tap:i18n';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';
import {moment} from 'meteor/momentjs:moment';
import BigNumber from 'bignumber.js';

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
// Page
import './home.html';
import './transfer';
import './exchange-transaction';
import './borrowing';
import './customer';

// Declare template
let indexTmpl = Template.MoneyTransfer_home,
    transferForm = Template.MoneyTransfer_transferForm,
    exchangeForm = Template.MoneyTransfer_exchangeTransactionForm,
    borrowForm = Template.MoneyTransfer_borrowingForm,
    customerForm=Template.MoneyTransfer_customerForm;

indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('home', {size: 'lg'});
    createNewAlertify('customer');
});
indexTmpl.onCreated(function () {
    // this.state = new ReactiveVar();
    // this.bigNumberTest=new ReactiveVar();
});

indexTmpl.helpers({
    // data(){
    //     return Template.instance().state.get();
    // },
    // test(){
    //     return Template.instance().bigNumberTest.get()
    // },
    // dateData(){
    //     let t=1000 * 60 * 60 * 24;
    //     return t;
    //     // Meteor.setTimeout(function() {
    //     //     //Tasks.remove(_id);
    //     //     alert("It's times");
    //     // }, 1000 * 60 * 60 * 24); // 2 seconds delay
    // }

});

indexTmpl.events({
    'click .transfer' (e, instance) {
        alertify.home(fa('plus', 'Transfer'), renderTemplate(transferForm));
    },
    'click .exchange' (e, instance) {
        alertify.home(fa('plus', 'Exchange Transaction'), renderTemplate(exchangeForm));
    },
    'click .borrow' (e, instance) {
        alertify.home(fa('plus', 'Borrowing'), renderTemplate(borrowForm));
    },
    'click .sender' (e, instance) {
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    },
    'click .receiver' (e, instance) {
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    },
    // 'click .equal'(event, instance){
    //     instance.state.set(0.3 - 0.1);
    //     //instance.state.set(0.6 * 3);
    //
    //     //instance.state.set(new BigNumber(0.3).minus(0.1).toFormat());
    // },
    // 'click .equalWithBigNumber'(event, instance){
    //     // let val1 = new  BigNumber(0.6);
    //     // let val2 = new  BigNumber(0.3);
    //     let val1 = new BigNumber(0.3);
    //     let val2 = new BigNumber(0.1);
    //     // or
    //     //BigNumber(2).add(10);
    //     //instance.state.set(new BigNumber((val1).times(val2)).toNumber());
    //     instance.bigNumberTest.set(new BigNumber(0.3).minus(new BigNumber(0.1)).toNumber());
    //     // instance.bigNumberTest.set(new BigNumber((val1).minus(val2)).toNumber());
    // },
    // 'click .alertDate'(e, instance){
    //     // var lastDate = moment('1/9/2016', 'DD/MM/YYYY');
    //     // //var b = moment('1/1/2013', 'DD/MM/YYYY');
    //     // var currentDate = moment();
    //     // var days = currentDate.diff(lastDate, 'days');
    //     // var numberDay = 10;
    //     //Meteor.call('countCustomerExpired') ;
    //     // if (days > numberDay) {
    //     //     alert(days);
    //     // }
    // }

});