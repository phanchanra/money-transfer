import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {AutoForm} from 'meteor/aldeed:autoform';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import 'meteor/theara:autoprint';
import 'printthis';

// Lib
import {displaySuccess, displayError} from '../../../../../core/client/libs/display-alert.js';

// // Component
import '../../../../../core/imports/ui/layouts/report/content.html';
import '../../../../../core/imports/ui/layouts/report/sign-footer.html';
import '../../../../../core/client/components/loading.js';
import '../../../../../core/client/components/form-footer.js';

// Method
//import {customerReport} from '../../../common/methods/reports/customer.js';

// Schema
import {TransferOutSchema} from '../../../api/collections/reports/transfer-out';

// Page
import './../reports/transfer-out.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_transferOutReport;

// State

// Index
indexTmpl.onCreated(function () {

});

indexTmpl.helpers({
    schema(){
        return TransferOutSchema;
    }

});

indexTmpl.events({
    // 'click [name="dateFrom"]'(e, instance){
    //     let dateFrom = $(e.currentTarget).val();
    //     let dateTo = instance.$('[name="dateTo"]').val();
    //
    //     if (Date.parse(dateFrom) > Date.parse(dateTo)) {
    //         swal("Please check", "Your date from is greater than date to!");
    //     }
    // },
    // 'click [name="dateTo"]'(e, instance){
    //     let dateTo = $(e.currentTarget).val();
    //     let dateFrom = instance.$('[name="dateFrom"]').val();
    //
    //     if (Date.parse(dateFrom) > Date.parse(dateTo)) {
    //         swal("Please check", "Your date to is less than date from!");
    //     }
    // }

})
;


// hook
let hooksObject = {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();

    },
    onSuccess: function (formType, result) {
    },
    onError: function (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks('MoneyTransfer_transferOutReport', hooksObject);
