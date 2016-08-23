import {Template} from  'meteor/templating';
import {TAPi18n} from 'meteor/tap:i18n';
import BigNumber from 'bignumber.js';

// Page
import './home.html';

Template.MoneyTransfer_home.onCreated(function () {
    this.state = new ReactiveVar();
});

Template.MoneyTransfer_home.helpers({
    data(){
        return Template.instance().state.get();
    }
});

Template.MoneyTransfer_home.events({
    'click .equal'(event, instance){
        //instance.state.set(0.3 - 0.1);
        instance.state.set(0.6 * 3);

        //instance.state.set(new BigNumber(0.3).minus(0.1).toFormat());
    },
    'click .equalWithBigNumber'(event, instance){
        let val1 = new  BigNumber(0.6);
        let val2 = new  BigNumber(0.3);
        // let val1 = new  BigNumber(0.3);
        // let val2 = new  BigNumber(0.1);
        instance.state.set(new BigNumber((val1).times(val2)).toNumber());
    }

});