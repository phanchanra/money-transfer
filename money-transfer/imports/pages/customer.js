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

// Tabular
import {CustomerTabular} from '../../common/tabulars/customer';
//function
// import {calculateIncome} from '../../common/globalState/calculateIncome'
// Page
import './customer.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_customer,
    actionTmpl = Template.MoneyTransfer_customerAction,
    formTmpl = Template.MoneyTransfer_customerForm,
    showTmpl = Template.MoneyTransfer_customerShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('customer', {size: 'lg'});
    createNewAlertify('customerShow');
});

indexTmpl.helpers({
    tabularTable(){
        return CustomerTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.customer(fa('plus', 'Customer'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.customer(fa('pencil', 'Customer'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        let id = this._id;
        Meteor.call('customerExist', this._id, function (error, result) {
            if (result) {
                displayError("This record has already used !");
                //swal("Sorry can not remove", "This customer is already used!");
            } else {
                destroyAction(
                    Customer, {_id: id}, {title: 'Customer', customerTitle: id}
                );
            }
        });
    },
    'click .js-display' (event, instance) {
        alertify.customerShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.customerById', currentData._id);
        }
    });
});

formTmpl.helpers({
    collection(){
        return Customer;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Customer.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.customerById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Customer.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.customer().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_customerForm'], hooksObject);
