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

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {Customer} from '../../common/collections/customer';

import './customerExpiredDate.html';
// Declare template
let indexTmpl = Template.MoneyTransfer_customerExpiredDate;
// Index
indexTmpl.onCreated(function () {
    // 1. Initialization
    let instance = this;
    // 2. initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(10);
    // instance.query = new ReactiveVar();

    instance.autorun(function () {
        // get the limit
        let limit = instance.limit.get();
        // let query = instance.query.get();
        let subscription = Meteor.subscribe('moneyTransfer.customerExpiredDateList', limit);
        // if subscription is ready, set limit to newLimit
        if (subscription.ready()) {
            instance.loaded.set(limit);
        } else {
            console.log("Subscription is not ready yet. \n\n");
        }
    });

    // 3. Cursor
    instance.customers = function () {
        let searchName = Session.get("prefix");
        //check for search
        if (searchName) {
            return Customer.find({name: {$regex: searchName + ".*", $options: 'i'}}, {limit: instance.loaded.get()});
        } else {
            return Customer.find({}, {limit: instance.loaded.get()});
        }
    }
});
indexTmpl.helpers({
    customerExpiredDate: function () {
        return Template.instance().customers();
    },
    customerCount: function () {
        return Template.instance().customers().count();
    },
    calExpiredDate(expiredDate){
        let currentDate = moment().toDate();
        return moment(currentDate).diff(expiredDate, 'days');
    },
    // are there more customer to show?
    hasMore: function () {
        return Template.instance().customers().count() >= Template.instance().limit.get();
    }
});
indexTmpl.events({
    'click .load-more': function (event, instance) {
        event.preventDefault();
        // get current value for limit, i.e. how many customer are currently displayed
        let limit = instance.limit.get();
        // increase limit by 5 and update it
        limit += 10;
        instance.limit.set(limit);
    },
    "keyup #searchValue": function (e) {
        //e.preventDefault();
        Session.set("prefix", $(e.currentTarget).val());

    }

});

