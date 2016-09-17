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

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
let tmpCollection = new Mongo.Collection(null);

// Tabular
import {TransferTabular} from '../../common/tabulars/transfer';
//function
// import {calculateIncome} from '../../common/globalState/calculateIncome'
// Page
import './transfer.html';
import './invoices/invoice.html';
// Declare template
let indexTmpl = Template.MoneyTransfer_transfer,
    actionTmpl = Template.MoneyTransfer_transferAction,
    formTmpl = Template.MoneyTransfer_transferForm,
    showTmpl = Template.MoneyTransfer_transferShow,
    productTabTmpl = Template.MoneyTransfer_productShowAction,
    productTmpl = Template.MoneyTransfer_transferProductShow,
    senderTmpl = Template.MoneyTransfer_transferSenderShow,
    receiverTmpl = Template.MoneyTransfer_transferReceiverShow,
    invoice = Template.generateInvoice;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('transfer', {size: 'lg'});
    createNewAlertify('transferShow');
    createNewAlertify('invoice', {size: 'lg'});
});

indexTmpl.helpers({
    tabularTable(){
        return TransferTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch'), type: {$in: ['IN', 'OUT']}};
        // return {branchId: Session.get('currentBranch'), status: 'Thai'};
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.transfer(fa('plus', 'Transfer'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        Session.set("transferId", this._id);
        //tmpCollection.findOne();
        tmpCollection.insert({
                totalFee: this.totalFee,
                totalAmount: this.totalAmount,
                fromAmount: this.feeDoc.fromAmount,
                toAmount: this.feeDoc.toAmount,
                customerFee: this.feeDoc.customerFee,
                ownerFee: this.feeDoc.ownerFee,
                agentFee: this.feeDoc.agentFee
            }
        );

        alertify.transfer(fa('pencil', 'Transfer'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Transfer,
            {_id: this._id},
            {title: 'Transfer', transferTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.transferShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    },
    'click .js-invoice' (event, instance) {
        let queryParams = this._id;
        Meteor.call('invoice', queryParams, function (err, doc) {
            alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc));
            // renderTemplate(invoice, doc);
            // let mode = 'iframe'; // popup
            // let close = mode == "popup";
            // let options = {mode: mode, popClose: close};
            // $("div.print").printArea(options);
            // printPageArea('print-invoice');
        });
    },
    'click .js-display-product' (event, instance) {
        Meteor.call("getProduct", this.productId, function (error, result) {
            alertify.transferShow(fa('eye', 'Product'), renderTemplate(productTmpl, result));
        });
    },
    'click .js-display-sender' (event, instance) {
        Meteor.call("getCustomer", this.senderId, function (error, result) {
            alertify.transferShow(fa('eye', 'Sender'), renderTemplate(senderTmpl, result));
        });
    },
    'click .js-display-receiver' (event, instance) {
        Meteor.call("getCustomer", this.receiverId, function (error, result) {
            alertify.transferShow(fa('eye', 'Receiver'), renderTemplate(receiverTmpl, result));
        });
    }
});

// Form
formTmpl.onRendered(function () {
    $('[name="amount"]').prop("readonly", true);
});
formTmpl.onCreated(function () {

    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.transferById', currentData._id);
        }
    });
    Session.set("type", false);
    //insertTmpCollection({});
    this.senderPhone = new ReactiveVar();
    this.receiverPhone = new ReactiveVar();
    this.currencyList = new ReactiveVar();
    //this.afterDisAmountFee = new ReactiveVar();
    //this.totalAmount = new ReactiveVar();
    // console.log(Session.get("productId"));
    // if (Session.get("productId")) {
    //     debugger;
    //     Meteor.call("getCurrency", Session.get("productId"), function (error, result) {
    //         if (result) {
    //             currencyList.set(result);
    //             $('[name="amount"]').prop("readonly", true);
    //         } else {
    //             $('[name="amount"]').prop("readonly", true);
    //
    //         }
    //     });
    // }
});

formTmpl.helpers({
    collection(){
        return Transfer;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Transfer.findOne({_id: currentData._id});
            data.type = 'update';
            let currencySymbol = data.doc.currencyId;
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
        }

        return data;
    },
    currencyList(){
        let instance = Template.instance();
        let currencies = instance.currencyList.get();
        if (currencies) {
            return currencies.map(function (c) {
                return {value: c, label: c}
            });
        } else {
            return [];
        }
    },
    senderPhone(){
        let instance = Template.instance();
        return instance.senderPhone.get();
    },
    receiverPhone(){
        let instance = Template.instance();
        return instance.receiverPhone.get();
    },
    customerFee(){
        let collection = tmpCollection.findOne();
        return collection ? collection.customerFee : 0;
    },
    afterDisAmountFee(){
        let collection = tmpCollection.findOne();
        return collection ? collection.totalFee : 0;
    },
    totalAmount(){
        let collection = tmpCollection.findOne();
        return collection ? collection.totalAmount : 0;
    },

});
invoice.events({
    'click #print' (e, instance) {
        //printDiv('print-invoice');
        var mode = 'iframe'; // popup
        var close = mode == "popup";
        var options = {mode: mode, popClose: close};
        $("div.print").printArea(options);
    }
});
formTmpl.events({
    'change [name="senderId"]'(e, instance){
        let senderId = $(e.currentTarget).val();
        Meteor.call("getCustomerInfo", senderId, function (error, result) {
            instance.senderPhone.set(result);
        });
    },
    'change [name="receiverId"]'(e, instance){
        let receiverId = $(e.currentTarget).val();
        Meteor.call("getCustomerInfo", receiverId, function (error, result) {
            instance.receiverPhone.set(result);
        });
    },
    'change [name="productId"]'(e, instance){
        let productId = $(e.currentTarget).val();
        Session.set("productId", productId);
        $('[name="currencyId"]').val('');
        clearOnchange();
        tmpCollection.remove({});
        Meteor.call("getCurrency", productId, function (error, result) {
            if (result) {
                instance.currencyList.set(result);
                instance.$('[name="amount"]').prop("readonly", true);
            } else {
                instance.$('[name="amount"]').prop("readonly", true);

            }
        });
    },
    'change [name="currencyId"]'(e, instance){
        let currencyId = $(e.currentTarget).val();
        //let currencySymbol = $(e.currentTarget).val();
        let symbol;
        if (currencyId == 'USD') {
            symbol = '$'
        } else if (currencyId == 'KHR') {
            symbol = '៛'
        } else {
            symbol = 'B'
        }
        Session.set("currencyId", currencyId);
        Session.set("currencySymbol", symbol);
        clearOnchange();
        tmpCollection.remove({});
        if (currencyId) {
            instance.$('[name="amount"]').prop("readonly", false);
        } else {
            instance.$('[name="amount"]').prop("readonly", true);
        }
    },
    'change [name="amount"]'(e, instance){
        let amount = parseFloat($(e.currentTarget).val());
        let productId = instance.$('[name="productId"]').val();
        let currencyId = instance.$('[name="currencyId"]').val();
        if (amount == "") {
            clearOnKeyupAmount();
        }
        Session.set("amount", amount);
        Meteor.call("checkValidateDepositWithdrawal", productId, currencyId, function (error, result) {
            if (result) {
                instance.$('.save').prop('disabled', false);
                instance.$('.save-print').prop('disabled', false);
            } else {
                instance.$('.save').prop('disabled', true);
                instance.$('.save-print').prop('disabled', true);
                swal("Please check", "You are not yet deposit amount!");
            }
        });
        Meteor.call("getFee", productId, currencyId, amount, function (error, result) {
            if (result) {
                tmpCollection.remove({});
                tmpCollection.insert(result);

                let totalAmount = calculateTotalAmount(amount, result.customerFee);
                tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                //, feeDoc: result
            }
        });
    },
    'keyup [name="discountFee"]'(e, instance){
        let discountFee = $(e.currentTarget).val();
        let amount = parseFloat(instance.$('[name="amount"]').val());
        let customerFee = instance.$('[name="customerFee"]').val();
        let totalFee = calculateAfterDiscount(customerFee, discountFee);
        let totalAmount = calculateTotalAmount(amount, totalFee);
        tmpCollection.update({}, {$set: {totalFee: totalFee, totalAmount: totalAmount}});
    },
    'click .js-print'(e, instance){
        Session.set("savePrint", true);
    }
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.transferById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Transfer.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    before: {
        insert(doc){
            doc.feeDoc = tmpCollection.findOne();
            //console.log(doc);
            return doc;
        },
        // ,
        update(doc){
            //console.log(doc);
            doc.$set.feeDoc = tmpCollection.findOne();
            return doc;
        }
    },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.transfer().close();
            if (Session.get("savePrint")) {
                Meteor.call('invoice', Session.get("transferId"), function (err, doc) {
                    alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc));

                });
            }
        } else {

            if (Session.get("savePrint")) {
                Meteor.call('invoice', result, function (err, doc) {
                    alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc));
                });
            }
        }


        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_transferForm'], hooksObject);
function insertTmpCollection({doc}) {
    if (_.isEmpty(doc)) {
        tmpCollection.remove({});
        tmpCollection.insert({
            fromAmount: 0,
            toAmount: 0,
            customerFee: 0,
            ownerFee: 0,
            agentFee: 0,
            totalFee: 0,
            totalAmount: 0
        });
    }
}
function clearOnchange() {
    $('[name="amount"]').val(0);
    $('[name="customerFee"]').val(0);
    $('[name="discountFee"]').val(0);
    $('[name="totalFee"]').val(0);
    $('[name="totalAmount"]').val(0);
}
function clearOnKeyupAmount() {
    $('[name="customerFee"]').val(0);
    $('[name="discountFee"]').val(0);
    $('[name="totalFee"]').val(0);
    $('[name="totalAmount"]').val(0);
}
function calculateAfterDiscount(customerFee, discountFee) {
    return customerFee * (1 - discountFee / 100);
}
function calculateTotalAmount(amount, disAmountFee) {
    return amount + disAmountFee;
}