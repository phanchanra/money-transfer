import {Template} from  'meteor/templating';
import {TAPi18n} from 'meteor/tap:i18n';
import BigNumber from 'bignumber.js';
// import 'p-loading';
// import 'p-loading/dist/css/p-loading.css';

// Page
import './home.html';

Template.MoneyTransfer_home.onCreated(function () {
    this.state = new ReactiveVar();
    this.bigNumberTest=new ReactiveVar();
});

Template.MoneyTransfer_home.helpers({
    data(){
        return Template.instance().state.get();
    },
    test(){
        return Template.instance().bigNumberTest.get()
    },
    dateData(){
        let t=1000 * 60 * 60 * 24;
        return t;
        // Meteor.setTimeout(function() {
        //     //Tasks.remove(_id);
        //     alert("It's times");
        // }, 1000 * 60 * 60 * 24); // 2 seconds delay
    }

});

Template.MoneyTransfer_home.events({
    'click .equal'(event, instance){
        instance.state.set(0.3 - 0.1);
        //instance.state.set(0.6 * 3);

        //instance.state.set(new BigNumber(0.3).minus(0.1).toFormat());
    },
    'click .equalWithBigNumber'(event, instance){
        // let val1 = new  BigNumber(0.6);
        // let val2 = new  BigNumber(0.3);
        let val1 = new BigNumber(0.3);
        let val2 = new BigNumber(0.1);
        // or
        //BigNumber(2).add(10);
        //instance.state.set(new BigNumber((val1).times(val2)).toNumber());
        instance.bigNumberTest.set(new BigNumber(0.3).minus(new BigNumber(0.1)).toNumber());
        // instance.bigNumberTest.set(new BigNumber((val1).minus(val2)).toNumber());
    },
    'click .alertDate'(e, instance){
        // var lastDate = moment('1/9/2016', 'DD/MM/YYYY');
        // //var b = moment('1/1/2013', 'DD/MM/YYYY');
        // var currentDate = moment();
        // var days = currentDate.diff(lastDate, 'days');
        // var numberDay = 10;
        //Meteor.call('countCustomerExpired') ;
        // if (days > numberDay) {
        //     alert(days);
        // }
    }

});