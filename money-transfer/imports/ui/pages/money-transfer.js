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
import {MoneyTransfer} from '../../api/collections/money-transfer';

// Tabular
import {MoneyTransferTabular} from '../../../common/tabulars/money-transfer';
import {calculateIncome} from '../../../common/globalState/calculateIncome'
let tmpCollection = new Mongo.Collection(null);
// Page
import './money-transfer.html';
import './invoices/fromThaInvoice.html';
// Declare template
let fromThaiInvoice = Template.generateFromThaiInvoice;
let indexTmpl = Template.MoneyTransfer_transfer,
    actionTmpl = Template.MoneyTransfer_transferAction,
    newTmpl = Template.MoneyTransfer_transferNew,
    editTmpl = Template.MoneyTransfer_transferEdit,
    showTmpl = Template.MoneyTransfer_transferShow;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('transfer', {size: 'lg'});
    createNewAlertify('transferInvoice', {size: 'lg'});
    createNewAlertify('transferShow',);

});
indexTmpl.onRendered(function () {
    Session.set('currencySession', 'THB');
});

indexTmpl.helpers({
    tabularTable(){
        return MoneyTransferTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch')};
        // return {branchId: Session.get('currentBranch'), status: 'Thai'};
    }
});

indexTmpl.events({

    'click .js-create' (event, instance) {
        alertify.transfer(fa('plus', TAPi18n.__('moneyTransfer.transfer.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.transfer(fa('pencil', TAPi18n.__('moneyTransfer.transfer.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            MoneyTransfer,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.transfer.title'), transferTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.transferShow(fa('eye', TAPi18n.__('moneyTransfer.transfer.title')), renderTemplate(showTmpl, this));
    },
    'click .js-invoice' (event, instance) {
        let queryParams = this._id;
        Meteor.call('fromThaiInvoice', queryParams, function (err, doc) {
            alertify.fromThaiInvoice(fa('', 'Invoice'), renderTemplate(fromThaiInvoice, doc));
        });
    }

});

fromThaiInvoice.events({
    'click #print' (e, instance) {
        //printDiv('print-invoice');
        var mode = 'iframe'; // popup
        var close = mode == "popup";
        var options = {mode: mode, popClose: close};
        $("div.print").printArea(options);
    }
});
// New
newTmpl.onCreated(function () {
    insertTmpCollection({});
    this.state = new ReactiveVar(0);
});
newTmpl.onRendered(function () {
    Session.set('currencySession', 'THB');
    $('[name="amountFee"]').val('0');
    let transferType = $('[name="transferType"]:checked').val();
    let feeType = $('[name="feeType"]:checked').val();
    Session.set("transferTypeSession", transferType);
    Session.set("feeTypeSession", feeType);
});

newTmpl.helpers({
    collection(){
        return MoneyTransfer;
    },
    isKHR(){
        let currency = Session.get('currencySession');
        return currency == 'KHR';
    },
    isTHB(){
        let currency = Session.get('currencySession');
        return currency == 'THB';
    },
    isUSD(){
        let currency = Session.get('currencySession');
        return currency == 'USD';
    },
    fee(){
        let collection = tmpCollection.findOne();
        return collection ? collection.fee : 0;
    },
    expend(){
        let collection = tmpCollection.findOne();
        return collection ? collection.expend : 0;
    },
    income(){
        let feeType=Session.get("feeTypeSession");
        // let supplierId=Session.get("supplierId");
        // Meteor.call("getSupplierId", supplierId, function (err, res) {
        //     if (res == "Internal") {
                if(feeType=="Default"){
                    let collection = tmpCollection.findOne();
                    return collection ? collection.income : 0;
                }else{
                    const income=Template.instance();
                    return income.state.get();
                }

        //     }
        // });
    }

});
newTmpl.events({
    'keypress [name="amount"],[name="exchange.0.fromAmount"],[name="exchange.1.fromAmount"]'(evt){
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'change [name="currency"]'(e, instance){
        let currency = $(e.currentTarget).val();
        Session.set('currencySession', currency);
        let amount = instance.$('[name="amount"]').val();
        instance.$('[name="remainAmount"]').val(amount);
        //$('#up-down').prop('checked', false);
    },
    'click [name="transferType"]'(e, instance){
        let transferType = instance.$('[name="transferType"]:checked').val();
        Session.set("transferTypeSession", transferType);
        let supplierId = Session.get("supplierId");
        let amount = Session.get("amount");
        Meteor.call("getSupplierId", supplierId, function (err, res) {
            if (res == "Internal") {
                if (transferType == "Out") {
                    insertTmpCollection({});
                } else {
                    Meteor.call('getFee', supplierId, amount, function (error, result) {
                        tmpCollection.remove({});
                        tmpCollection.insert(result);
                    });
                }
            } else {
                Meteor.call('getFee', supplierId, amount, function (error, result) {
                    tmpCollection.remove({});
                    tmpCollection.insert(result);
                });
            }
        });


    },
    // check fee amount readonly
    'click [name="feeType"]'(e, instance){
        let checkReadOnly = $(e.currentTarget).val();
        let feeType = instance.$('[name="feeType"]:checked').val();
        Session.set("feeTypeSession", feeType);
        let supplierId = Session.get("supplierId");
        let amount = Session.get("amount");
        let transferType = Session.get("transferTypeSession");

        let feeAmount = instance.$('[name="amountFee"]');
        let expend = instance.$('[name="expend"]');
        let income = instance.$('[name="income"]');
        // if (checkReadOnly == 'Custom') {
        //     feeAmount.prop("readonly", false);
        //     expend.prop("readonly", false);
        //     income.prop("readonly", false);
        //     feeAmount.val(0);
        //     expend.val(0);
        //     income.val(0);
        // } else {
        //feeAmount.prop("readonly", true);
        //expend.prop("readonly", true);
        Meteor.call("getSupplierId", supplierId, function (err, res) {
            //check internal
            if (res == "Internal") {
                if (transferType == "In") {
                    if (checkReadOnly == "Default") {
                        Meteor.call('getFee', supplierId, amount, function (error, result) {
                            tmpCollection.remove({});
                            tmpCollection.insert(result);
                        });
                    } else {
                        feeAmount.prop("readonly", false);
                        expend.prop("readonly", false);
                        insertTmpCollection({});
                        instance.state.set(0);
                    }
                }
                //check external
            } else {
                if (checkReadOnly == "Default") {
                    feeAmount.prop("readonly", true);
                    Meteor.call('getFee', supplierId, amount, function (error, result) {
                        tmpCollection.remove({});
                        tmpCollection.insert(result);
                    });
                } else {
                    feeAmount.prop("readonly", false);
                    insertTmpCollection({});
                    instance.state.set(0);
                }
            }
        });
        //}
    },
    'change [name=supplierId]'(e, instance){
        let checkStatus = $(e.currentTarget).val();
        Session.set("supplierId", checkStatus);
        insertTmpCollection({});
        if (checkStatus != '') {
            instance.$('[name="amount"]').prop('readonly', false);
        }
        instance.$('[name="amount"]').val(0);

    },
    'keyup [name="amount"]'(e, instance){
        let amount = parseFloat($(e.currentTarget).val());
        Session.set("amount", amount);
        let supplierId = Session.get("supplierId");

        let fromAmount0 = parseFloat($('[name="exchange.0.fromAmount"]').val());
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let fromAmount1 = parseFloat($('[name="exchange.1.fromAmount"]').val());
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let chAmount = amount - (fromAmount0 + fromAmount1);
        $('[name="remainAmount"]').val(chAmount);
        let checkCustomFee = $('[name="feeType"]:checked').val();
        if (checkCustomFee == 'Custom') {
            $('[name="amountFee"]').val('0');
        } else {
            Meteor.call('getFee', supplierId, amount, function (error, result) {
                tmpCollection.remove({});
                tmpCollection.insert(result);
            });
        }
    },
    'keyup [name="amountFee"]'(e, instance){
        let fee = $(e.currentTarget).val();
        let expend = instance.$('[name="expend"]').val();
        instance.state.set(calculateIncome(fee, expend));
    },
    'keyup [name="expend"]'(e, instance){
        let expend = $(e.currentTarget).val();
        let fee = instance.$('[name="amountFee"]').val();
        instance.state.set(calculateIncome(fee, expend));
    },
    'keyup [name="exchange.0.fromAmount"]'(e){
        let currency = Session.get('currencySession');

        let fromAmount0 = $(e.currentTarget).val();
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let fromAmount1 = $('[name="exchange.1.fromAmount"]').val();
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let bothFrom = fromAmount0 + fromAmount1;
        let amount = parseFloat($('[name="amount"]').val());
        //check both amount form0 form1
        if (fromAmount0 > amount || bothFrom > amount) {
            //check condition
            let chFromAmount0 = $('[name="exchange.0.fromAmount"]');
            let chToAmount0 = $('[name="exchange.0.toAmount"]');
            // let chFromAmount1 = $('[name="exchange.1.fromAmount"]');
            // let chToAmount1 = $('[name="exchange.1.toAmount"]');
            chFromAmount0.val('0');
            chToAmount0.val('0');
            // chFromAmount1.val('0');
            // chToAmount1.val('0');
            $('[name="remainAmount"]').val(amount);
            alertify.error("From amount must less than amount!");
        } else {
            Meteor.call('dynamicCurrency', currency, amount, fromAmount0, fromAmount1, function (er, re) {
                //
                $('[name="exchange.0.toAmount"]').val(re.ex1);
                $('[name="exchange.1.toAmount"]').val(re.ex2);
                $('[name="remainAmount"]').val(re.res);
            });
        }
    },
    'keyup [name="exchange.1.fromAmount"]'(e){
        let currency = Session.get('currencySession');

        let fromAmount1 = $(e.currentTarget).val();
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let fromAmount0 = $('[name="exchange.0.fromAmount"]').val();
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let bothFrom = fromAmount1 + fromAmount0;
        let amount = parseFloat($('[name="amount"]').val());
        //check both amount form0 form1
        if (fromAmount0 > amount || bothFrom > amount) {
            //check condition
            let chFromAmount0 = $('[name="exchange.0.fromAmount"]');
            let chToAmount0 = $('[name="exchange.0.toAmount"]');
            let chFromAmount1 = $('[name="exchange.1.fromAmount"]');
            let chToAmount1 = $('[name="exchange.1.toAmount"]');
            chFromAmount0.val('0');
            chToAmount0.val('0');
            chFromAmount1.val('0');
            chToAmount1.val('0');
            $('[name="remainAmount"]').val(amount);
            alertify.error("From amount must less than amount!");
        } else {
            Meteor.call('dynamicCurrency', currency, amount, fromAmount0, fromAmount1, function (er, re) {
                //
                $('[name="exchange.0.toAmount"]').val(re.ex1);
                $('[name="exchange.1.toAmount"]').val(re.ex2);
                $('[name="remainAmount"]').val(re.res);
            });
        }

    }


});
newTmpl.onDestroyed(function () {
    tmpCollection.remove({});
});
// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.fromThaiById', {fromThaiId: this.data._id});
    });
});
editTmpl.helpers({
    collection(){
        return FromThai;
    },
    data () {
        let data = FromThai.findOne(this._id);
        Session.set('currencySession', data.currency);
        return data;
    },
    isKHR(){
        let currency = Session.get('currencySession');
        return currency == 'KHR';
    },
    isTHB(){
        let currency = Session.get('currencySession');
        return currency == 'THB';
    },
    isUSD(){
        let currency = Session.get('currencySession');
        return currency == 'USD';
    }
});
editTmpl.events({
    'change [name="currency"]'(e){
        let currency = $(e.currentTarget).val();
        Session.set('currencySession', currency);
        $('#up-down').prop('checked', false);
    },
    // check fee amount readonly
    'change [name="feeType"]'(e){
        let checkReadOnly = $(e.currentTarget).val();
        let feeAmount = $('[name="amountFee"]');
        if (checkReadOnly == 'Custom') {
            feeAmount.prop("readonly", false);
            feeAmount.val('0');
        } else {
            feeAmount.prop("readonly", true);
            feeAmount.val('0');
        }
    },
    'keypress [name="amount"],[name="exchange.0.fromAmount"],[name="exchange.1.fromAmount"]'(evt){
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'keyup [name="amount"]'(e){
        let amount = parseFloat($(e.currentTarget).val());
        let fromAmount0 = parseFloat($('[name="exchange.0.fromAmount"]').val());
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let fromAmount1 = parseFloat($('[name="exchange.1.fromAmount"]').val());
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let chAmount = amount - (fromAmount0 + fromAmount1);
        $('[name="remainAmount"]').val(chAmount);
        let checkCustomFee = $('[name="feeType"]:checked').val();
        if (checkCustomFee == 'Custom') {
            $('[name="amountFee"]').val('0');
        } else {
            Meteor.call('getThaiFee', amount, function (error, result) {
                $('[name="amountFee"]').val(result);
            });
        }
    },
    'change #up-down'(e){
        let checkHideShow = $('[name="up-down"]:checked').val();

        if (checkHideShow) {
            $('#up-down-slide').slideDown(500);
        } else {
            $('#up-down-slide').slideUp(500);
            style = "display: none;"
        }
    },
    'keyup [name="exchange.0.fromAmount"]'(e){
        let currency = Session.get('currencySession');

        let fromAmount0 = $(e.currentTarget).val();
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let fromAmount1 = $('[name="exchange.1.fromAmount"]').val();
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let bothFrom = fromAmount0 + fromAmount1;
        let amount = parseFloat($('[name="amount"]').val());
        //check both amount form0 form1
        if (fromAmount0 > amount || bothFrom > amount) {
            //check condition
            let chFromAmount0 = $('[name="exchange.0.fromAmount"]');
            let chToAmount0 = $('[name="exchange.0.toAmount"]');
            let chFromAmount1 = $('[name="exchange.1.fromAmount"]');
            let chToAmount1 = $('[name="exchange.1.toAmount"]');
            chFromAmount0.val('0');
            chToAmount0.val('0');
            chFromAmount1.val('0');
            chToAmount1.val('0');
            $('[name="remainAmount"]').val(amount);
            alertify.error("From amount must less than amount!");
        } else {
            Meteor.call('dynamicCurrency', currency, amount, fromAmount0, fromAmount1, function (er, re) {
                //
                $('[name="exchange.0.toAmount"]').val(re.ex1);
                $('[name="exchange.1.toAmount"]').val(re.ex2);
                $('[name="remainAmount"]').val(re.res);
            });
        }
    },
    'keyup [name="exchange.1.fromAmount"]'(e){
        let currency = Session.get('currencySession');

        let fromAmount1 = $(e.currentTarget).val();
        fromAmount1 = fromAmount1 == "" ? 0 : parseFloat(fromAmount1);

        let fromAmount0 = $('[name="exchange.0.fromAmount"]').val();
        fromAmount0 = fromAmount0 == "" ? 0 : parseFloat(fromAmount0);

        let bothFrom = fromAmount1 + fromAmount0;
        let amount = parseFloat($('[name="amount"]').val());
        //check both amount form0 form1
        if (fromAmount0 > amount || bothFrom > amount) {
            //check condition
            let chFromAmount0 = $('[name="exchange.0.fromAmount"]');
            let chToAmount0 = $('[name="exchange.0.toAmount"]');
            let chFromAmount1 = $('[name="exchange.1.fromAmount"]');
            let chToAmount1 = $('[name="exchange.1.toAmount"]');
            chFromAmount0.val('0');
            chToAmount0.val('0');
            chFromAmount1.val('0');
            chToAmount1.val('0');
            $('[name="remainAmount"]').val(amount);
            alertify.error("From amount must less than amount!");
        } else {
            Meteor.call('dynamicCurrency', currency, amount, fromAmount0, fromAmount1, function (er, re) {
                //
                $('[name="exchange.0.toAmount"]').val(re.ex1);
                $('[name="exchange.1.toAmount"]').val(re.ex2);
                $('[name="remainAmount"]').val(re.res);
            });
        }
    }

});

// Show
showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.fromThai.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = this;
        return data;
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            doc.status = "Thai";
            return doc;
        }
    },

    onSuccess (formType, result) {
        if (formType == 'update') {
            console.log(result);
            // Meteor.call('fromThaiInvoice', result, function (err, doc) {
            //     alertify.fromThaiInvoice(fa('', 'Invoice'), renderTemplate(fromThaiInvoice, doc));
            // });
            alertify.transfer().close();
        } else {
            let transferType = Session.get('transferTypeSession');
            let feeType = Session.get('feeTypeSession');
            //check transfer type
            if (transferType == 'In') {
                $('[name="transferType"][value="In"]').prop('checked', true);
            } else {
                $('[name="transferType"][value="Out"]').prop('checked', true);
            }
            //check fee tyoe
            if (feeType == 'Default') {
                $('[name="feeType"][value="Default"]').prop('checked', true);
            } else {
                $('[name="feeType"][value="Custom"]').prop('checked', true);
            }
            $('[name="exchange.0.fromAmount"]').val('0');
            $('[name="exchange.1.fromAmount"]').val('0');
            $('[name="exchange.0.toAmount"]').val('0');
            $('[name="exchange.1.toAmount"]').val('0');

            Meteor.call('fromThaiInvoice', result, function (err, doc) {
                //console.log(doc);
                alertify.fromThaiInvoice(fa('', 'Invoice'), renderTemplate(fromThaiInvoice, doc));

            });
        }
        displaySuccess();

    },
    onError (formType, error) {
        displayError(error.message);
    }

};

AutoForm.addHooks([
    'MoneyTransfer_transferNew',
    'MoneyTransfer_transferEdit'
], hooksObject);

function insertTmpCollection({doc}) {
    if (_.isEmpty(doc)) {
        tmpCollection.remove({});
        tmpCollection.insert({income: 0, fee: 0, expend: 0, amount: 0});
    }
}