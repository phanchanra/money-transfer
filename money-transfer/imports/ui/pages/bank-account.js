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
import {createNewAlertify} from '../../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/column-action.js';
import '../../../../core/client/components/form-footer.js';

// Collection
import {Transfer} from '../../api/collections/transfer';
import {Product} from '../../api/collections/product';
// Tabular
import {BankAccountTabular} from '../../../common/tabulars/bank-account';
//function
// import {calculateIncome} from '../../../common/globalState/calculateIncome'
// Page
import './bank-account.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_bankAccount,
    actionTmpl = Template.MoneyTransfer_bankAccountAction,
    formTmpl = Template.MoneyTransfer_bankAccountForm,
    showTmpl = Template.MoneyTransfer_bankAccountShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('bankAccount');
    createNewAlertify('bankAccountShow');
    this.autorun(()=> {
        this.subscribe('moneyTransfer.productById', FlowRouter.getParam('productId'));
    });
});

indexTmpl.helpers({
    tabularTable(){
        return BankAccountTabular;
    },
    selector() {
        return {
            productId: FlowRouter.getParam('productId'),
            currencyId: FlowRouter.getParam('currencyId'),
            type: {$in: ['CD', 'CW']}
        };
        // return {branchId: Session.get('currentBranch'), status: 'Thai'};
    },
    label(){
        let product = Product.findOne(FlowRouter.getParam('productId'));
        if (product) {
            let products = product._id + '-' + product.name;
            return ["[Pro:" + products + "|" + "Cur:" + FlowRouter.getParam('currencyId') + "]"];
        } else {
            return "";
        }
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {

        alertify.bankAccount(fa('plus', 'Bank Account'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.bankAccount(fa('pencil', 'Bank Account'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Transfer,
            {_id: this._id},
            {title: 'Bank Account', bankAccountTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.bankAccountShow(fa('eye', 'Bank Account'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.bankAccountById', currentData._id);
        }
        Session.set("type", true);
        //this.subscribe('moneyTransfer.productById', FlowRouter.getParam('productId'));
    });
});

formTmpl.helpers({
    collection(){
        return Transfer;
    },
    selector() {
        //return {branchId: Session.get('currentBranch')};
        //return {productId: Session.get('currentBranch'), status: 'Thai'};
        let productId = FlowRouter.getParam('productId');
        let currencyId = FlowRouter.getParam('currencyId');
        return {productId: productId, currencyId: currencyId};
    },
    label(){
        let product = Product.findOne(FlowRouter.getParam('productId'));
        let products = product._id + '-' + product.name;
        return ["[ Pro:" + products + "|" + "Cur:" + FlowRouter.getParam('currencyId') + "]"];

    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Transfer.findOne({_id: currentData._id});
            data.type = 'update';
        }
        let currencySymbol = FlowRouter.getParam('currencyId');
        if (currencySymbol == 'USD') {
            symbol = '$';
            Session.set("currencySymbol", symbol);

        } else if (currencySymbol == 'KHR') {
            symbol = '៛';
            Session.set("currencySymbol", symbol);

        } else {
            symbol = 'B';
            Session.set("currencySymbol", symbol);

        }
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.bankAccountById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Transfer.findOne(currentData._id);
    }
});
formTmpl.events({
    'keyup [name="amount"]'(e, instance){
        Session.set("amount", $(e.currentTarget).val())
    }
});
// Hook
let hooksObject = {
    before: {
        insert(doc){
            doc.productId = FlowRouter.getParam('productId');
            doc.currencyId = FlowRouter.getParam('currencyId');

            return doc;
        }

    },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.bankAccount().close();
        }

        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['MoneyTransfer_bankAccountForm'], hooksObject);
