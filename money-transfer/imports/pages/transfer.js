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
BigNumber.config({ERRORS: false});

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';
import {clearSelectize} from '../../../core/client/libs/clear-select';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
let tmpCollection = new Mongo.Collection(null);
//let exchangeItemCollection = new Mongo.Collection(null);
// Tabular
import {TransferTabular} from '../../common/tabulars/transfer';
//function
// Page
import './transfer.html';
import '../reports/transferInvoice.html';
import './customer.js';
// Declare template
let indexTmpl = Template.MoneyTransfer_transfer,
    actionTmpl = Template.MoneyTransfer_transferAction,
    formTmpl = Template.MoneyTransfer_transferForm,
    showTmpl = Template.MoneyTransfer_transferShow,
    productTabTmpl = Template.MoneyTransfer_productShowAction,
    productTmpl = Template.MoneyTransfer_transferProductShow,
    senderTmpl = Template.MoneyTransfer_transferSenderShow,
    receiverTmpl = Template.MoneyTransfer_transferReceiverShow,
    invoice = Template.generateInvoice,
    customerForm = Template.MoneyTransfer_customerForm;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('transfer', {size: 'lg'});
    createNewAlertify('customer');
    createNewAlertify('transferShow');
    createNewAlertify('invoice', {size: 'lg'});

});

indexTmpl.helpers({
    tabularTable(){
        return TransferTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch'), type: {$in: ['IN', 'OUT']}};
    }
});

let state = new ReactiveObj({
    baseAmountFirst: 0,
    baseAmountSecond: 0,
    toAmountFirst: 0.00,
    toAmountSecond: 0.00,
    exchangeTransfer: '',
    currencyList: '',
    promotionLabel: '',
    promotion: {},
    promotionAmount: 0,
    promotionId: '',
    customerFee: 0,
    exchangeId: '',
});
invoice.helpers({
    userName(){
        return Meteor.user().profile.name;
    }
});
indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.transfer(fa('plus', 'Transfer'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        Session.set("transferId", this._id);
        //
        let currencySymbol = this.currencyId;
        Session.set('currencyId', this.currencyId);
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
        //
        Meteor.call("getCurrency", this.productId, function (error, result) {
            if (result) {
                state.set('currencyList', result);
                // instance.$('[name="amount"]').prop("readonly", true);
            } else {
                // instance.$('[name="amount"]').prop("readonly", true);
            }
        });
        //
        state.set("promotionId", this.promotionId);
        state.set('transferDate', this.transferDate);
        state.set('customerFee', this.customerFee);
        //

        let totalFee = this.totalFee;
        let totalAmount = this.totalAmount;
        let feeDocAmount = this.feeDoc.fromAmount;
        let feeDocToAmount = this.feeDoc.toAmount;
        let feeDocCustomerFee = this.feeDoc.customerFee;
        let feeDocOwnerFee = this.feeDoc.ownerFee;
        let feeDocAgentFee = this.feeDoc.agentFee;
        Meteor.call('lastTransferIdRemoveEdit', {
            _id: this._id,
            productId: this.productId,
            currencyId: this.currencyId
        }, (error, result) => {
            if (result) {
                //tmpCollection.findOne();
                tmpCollection.insert({
                        totalFee: totalFee,
                        totalAmount: totalAmount,
                        fromAmount: feeDocAmount,
                        toAmount: feeDocToAmount,
                        customerFee: feeDocCustomerFee,
                        ownerFee: feeDocOwnerFee,
                        agentFee: feeDocAgentFee
                    }
                );
                alertify.transfer(fa('pencil', 'Transfer'), renderTemplate(formTmpl, this));
            } else {
                displayError("This record is not last!");
            }
        });

    },
    'click .js-destroy' (event, instance) {
        let id = this._id;
        Meteor.call('lastTransferIdRemoveEdit', {
            _id: this._id,
            productId: this.productId,
            currencyId: this.currencyId
        }, function (error, result) {
            if (result) {
                destroyAction(
                    Transfer,
                    {_id: id},
                    {title: 'Transfer', transferTitle: id}
                );
            } else {
                displayError("This record is not last");
            }
        });
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

formTmpl.onCreated(function () {
    this.senderPhone = new ReactiveVar();
    this.receiverPhone = new ReactiveVar();
    this.currencyList = new ReactiveVar();
    this.amount = new ReactiveVar();
    //this.toAmountFirst = new ReactiveVar();
    //this.toAmountSecond = new ReactiveVar();
    this.autorun(()=> {
        let currentData = Template.currentData();
        let senderDoc = Session.get('senderId');
        let receiverDoc = Session.get('receiverId');
        if (currentData) {
            this.subscribe('moneyTransfer.transferById', currentData._id);
        }
        if (senderDoc) {
            if (senderDoc.telephone && senderDoc.flag == 'sender') {
                this.senderPhone.set(senderDoc.telephone);
            } else if (senderDoc.telephone && senderDoc.flag == 'receiver') {
                this.receiverPhone.set(senderDoc.telephone);
            } else {
                Meteor.call("getCustomerInfo", senderDoc.senderId, (error, result) => {
                    this.senderPhone.set(result);
                });
            }
        }
        //
        if (receiverDoc) {
            Meteor.call("getCustomerInfo", receiverDoc.receiverId, (err, res) => {
                this.receiverPhone.set(res);
            });
        }

    });
    Session.set("type", false);
});
// Form
formTmpl.onRendered(function () {
    // jQuery(function () {
    //     jQuery("#timeNote").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "TimeNote is required"
    //     });
    //     jQuery("#dateNote").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "DateNote is required"
    //     });
    //     jQuery("#senderId").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "Please make a selection"
    //     });
    //     jQuery("#senderTelephone").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "DateNote is required"
    //     });
    //     jQuery("#receiverId").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "Please make a selection"
    //     });
    //     jQuery("#receiverTelephone").validate({
    //         expression: "if (VAL) return true; else return false;",
    //         message: "DateNote is required"
    //     });
    //
    // });


    //
    $('[name="amount"]').prop("readonly", true);
    $('[name="sellingFirst"]').prop("readonly", true);
    $('[name="sellingSecond"]').prop("readonly", true);
    $('[name="baseAmountFirst"]').prop("readonly", true);
    $('[name="baseAmountSecond"]').prop("readonly", true);
    let transferDate = $('[name="transferDate"]').val();

    Session.set('transferType', $('[name="transferType"]').val());
    Meteor.call('promotionLabel', transferDate, function (error, result) {
        if (result) {
            state.set('promotionLabel', 'Promotion');
            //$('.hide-show').slideDown(300);

        } else {
            state.set('promotionLabel', "None Promotion");
            //$('.hide-show').slideUp(300);
            state.set('promotion', 0);

        }
    });
    $('.hide-show').slideDown(300);


});

formTmpl.helpers({
    collection(){
        return Transfer;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.type = 'update';
            data.doc = Transfer.findOne({_id: currentData._id});
            // tmpExchangeTransfer = [];
            // data.doc.items.forEach(function (obj) {
            //     tmpExchangeTransfer.push({
            //         convertTo: obj.convertTo,
            //         selling: obj.selling
            //     });
            //     if (obj != undefined) {
            //         //state.set("exchangeTransfer", obj.convertTo);
            //         if (obj._id == "001") {
            //             state.set('baseAmountFirst', obj.baseAmount);
            //             state.set('toAmountFirst', obj.toAmount);
            //
            //         } else if (obj._id == "002") {
            //             state.set('baseAmountSecond', obj.baseAmount);
            //             state.set('toAmountSecond', obj.toAmount);
            //         }
            //     }
            // });
            //state.set('promotion', data.doc.promotionAmount);
            //state.set("exchangeTransfer", tmpExchangeTransfer);

            //

            Meteor.call('promotionLabel', state.get('transferDate'), function (error, result) {
                if (result) {
                    state.set('promotionLabel', 'Promotion');
                } else {
                    state.set('promotionLabel', "None Promotion");
                }
            });
        }

        return data;
    },
    currencyList(){
        let currencies = state.get('currencyList');
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
        //console.log(instance.receiverPhone.get());
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
    senderId(){
        let senderDoc = Session.get('senderId');
        if (senderDoc && senderDoc.flag == 'sender') {
            return senderDoc._id;
        }
    },
    receiverId(){
        let receiverDoc = Session.get('senderId');
        if (receiverDoc && receiverDoc.flag == 'receiver') {
            return receiverDoc._id;
        }
    },
    amount(){
        let instance = Template.instance();
        return instance.amount.get();
    },
    /////////////
    exchangeTransferLabelFirst(){
        if (Session.get('currencyId')) {
            try {
                //let exchangeTransfer = Session.get("exchangeTransfer");

                let exchangeTransfer = state.get("exchangeTransfer");
                let exchangeLabelFirst = exchangeTransfer ? exchangeTransfer[0] : undefined;
                if (exchangeLabelFirst) {
                    return exchangeLabelFirst.convertTo;
                }
            } catch (e) {
            }
        }
        //return '';


    },
    exchangeTransferLabelSecond(){
        if (Session.get('currencyId')) {
            try {
                //let exchangeTransfer = Session.get("exchangeTransfer");
                let exchangeTransfer = state.get("exchangeTransfer");
                let exchangeLabelSecond = exchangeTransfer ? exchangeTransfer[1] : undefined;
                //console.log(exchangeLabelFirst);
                if (exchangeLabelSecond) {
                    return exchangeLabelSecond.convertTo;
                }
            } catch (e) {
            }
        }
        //return '';
    },
    exchangeTransferFormFirst(){
        if (Session.get('currencyId')) {
            try {
                //let exchangeTransferFirst = Session.get("exchangeTransfer");
                let exchangeTransferFirst = state.get("exchangeTransfer");
                let exchangeFormFirst = exchangeTransferFirst ? exchangeTransferFirst[0] : undefined;
                if (exchangeFormFirst) {
                    return exchangeFormFirst.selling;
                }
            } catch (e) {
            }
        }
        //return '';


    },
    exchangeTransferFormSecond(){
        if (Session.get('currencyId')) {
            try {
                //let exchangeTransferSecond = Session.get("exchangeTransfer");
                let exchangeTransferSecond = state.get("exchangeTransfer");
                let exchangeFormSecond = exchangeTransferSecond ? exchangeTransferSecond[1] : undefined;
                if (exchangeFormSecond) {
                    return exchangeFormSecond.selling;
                }
            } catch (e) {

            }
        }
        //return '';
    },
    // baseAmountFirst(){
    //     return state.get('baseAmountFirst');
    // },
    // baseAmountSecond(){
    //     return state.get('baseAmountSecond');
    // },
    exchangeId(){
        let exchangeId = state.get('exchangeId');
        if (exchangeId) {
            return exchangeId;
        }
    },
    toAmountFirst(){
        let toAmountFirst = state.get('toAmountFirst');
        if (toAmountFirst) {
            return toAmountFirst;
        }

    },
    toAmountSecond(){
        let toAmountSecond = state.get('toAmountSecond');
        if (toAmountSecond) {
            return toAmountSecond;
        }

    },
    //////////////////////
    // isExist(){
    //     let transferType = Session.get('transferType');
    //     console.log(transferType);
    //     return transferType == 'thai';
    //
    // },
    // toAmountFirst(){
    //     let instance = Template.instance();
    //     return instance.toAmountFirst.get();
    // },
    promotionLabel(){
        return state.get('promotionLabel');
    },
    promotionAmount(){
        return state.get('promotionAmount');
    },
    promotion(){
        // console.log(state.get('promotion'));
        return state.get('promotion');
    }

});
formTmpl.onDestroyed(function () {
    Session.set('senderId', undefined);
    Session.set('receiverId', undefined);
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
    'click .form-control'(e){
        $(e.currentTarget).css('border-color', '');
    },
    'click #save'(e, instance){
        let type = $('input:radio[name=type]:checked').val();
        let transferType = $('input:radio[name=transferType]:checked').val();
        let dateNote = instance.$('[name="dateNote"]').val();
        let timeNote = instance.$('[name="timeNote"]').val();
        let refCode = instance.$('[name="refCode"]').val();
        let senderId = instance.$('[name="senderId"]').val();
        let senderTelephone = instance.$('[name="senderTelephone"]').val();
        let receiverId = instance.$('[name="receiverId"]').val();
        let receiverTelephone = instance.$('[name="receiverTelephone"]').val();
        if (transferType == 'khmer') {
            $('[name="timeNote"]').css('border-color', '');
            $('[name="dateNote"]').css('border-color', '');
            if (refCode == '') {
                alertify.error('Please input refCode.');
                $('[name="refCode"]').css('border-color', 'red');
                return false;
            }
            if (type == 'OUT') {
                if (senderId == '') {
                    alertify.error('Please input Sender.');
                    $('[name="senderId"]').css('border-color', 'red');
                    return false;
                }
                if (senderTelephone == '') {
                    alertify.error('Please input Sender Phone.');
                    $('[name="senderTelephone"]').css('border-color', 'red');
                    return false;
                }
                if (receiverId == '') {
                    alertify.error('Please input receiver.');
                    $('[name="receiverId"]').css('border-color', 'red');
                    return false;
                }
                if (receiverTelephone == '') {
                    alertify.error('Please input receiver phone.');
                    $('[name="receiverTelephone"]').css('border-color', 'red');
                    return false;
                }
            }else{
                if (receiverId == '') {
                    alertify.error('Please input receiver.');
                    $('[name="receiverId"]').css('border-color', 'red');
                    return false;
                }
                if (receiverTelephone == '') {
                    alertify.error('Please input receiver phone.');
                    $('[name="receiverTelephone"]').css('border-color', 'red');
                    return false;
                }
            }
        } else {
            if (dateNote == '') {
                alertify.error('Please input Date Note.');
                $('[name="dateNote"]').css('border-color', 'red');
                return false;
            }
            if (timeNote == '') {
                alertify.error('Please input Time Note.');
                $('[name="timeNote"]').css('border-color', 'red');
                return false;
            }
            if (senderId == '') {
                alertify.error('Please input Sender.');
                $('[name="senderId"]').css('border-color', 'red');
                return false;
            }
            if (senderTelephone == '') {
                alertify.error('Please input Sender Phone.');
                $('[name="senderTelephone"]').css('border-color', 'red');
                return false;
            }
            if (receiverId == '') {
                alertify.error('Please input receiver.');
                $('[name="receiverId"]').css('border-color', 'red');
                return false;
            }
            if (receiverTelephone == '') {
                alertify.error('Please input receiver phone.');
                $('[name="receiverTelephone"]').css('border-color', 'red');
                return false;
            }
        }
    },'click #save-print'(e, instance){
        let type = $('input:radio[name=type]:checked').val();
        let transferType = $('input:radio[name=transferType]:checked').val();
        let dateNote = instance.$('[name="dateNote"]').val();
        let timeNote = instance.$('[name="timeNote"]').val();
        let refCode = instance.$('[name="refCode"]').val();
        let senderId = instance.$('[name="senderId"]').val();
        let senderTelephone = instance.$('[name="senderTelephone"]').val();
        let receiverId = instance.$('[name="receiverId"]').val();
        let receiverTelephone = instance.$('[name="receiverTelephone"]').val();
        if (transferType == 'khmer') {
            $('[name="timeNote"]').css('border-color', '');
            $('[name="dateNote"]').css('border-color', '');
            if (refCode == '') {
                alertify.error('Please input refCode.');
                $('[name="refCode"]').css('border-color', 'red');
                return false;
            }
            if (type == 'OUT') {
                if (senderId == '') {
                    alertify.error('Please input Sender.');
                    $('[name="senderId"]').css('border-color', 'red');
                    return false;
                }
                if (senderTelephone == '') {
                    alertify.error('Please input Sender Phone.');
                    $('[name="senderTelephone"]').css('border-color', 'red');
                    return false;
                }
                if (receiverId == '') {
                    alertify.error('Please input receiver.');
                    $('[name="receiverId"]').css('border-color', 'red');
                    return false;
                }
                if (receiverTelephone == '') {
                    alertify.error('Please input receiver phone.');
                    $('[name="receiverTelephone"]').css('border-color', 'red');
                    return false;
                }
            }else{
                if (receiverId == '') {
                    alertify.error('Please input receiver.');
                    $('[name="receiverId"]').css('border-color', 'red');
                    return false;
                }
                if (receiverTelephone == '') {
                    alertify.error('Please input receiver phone.');
                    $('[name="receiverTelephone"]').css('border-color', 'red');
                    return false;
                }
            }
        } else {
            if (dateNote == '') {
                alertify.error('Please input Date Note.');
                $('[name="dateNote"]').css('border-color', 'red');
                return false;
            }
            if (timeNote == '') {
                alertify.error('Please input Time Note.');
                $('[name="timeNote"]').css('border-color', 'red');
                return false;
            }
            if (senderId == '') {
                alertify.error('Please input Sender.');
                $('[name="senderId"]').css('border-color', 'red');
                return false;
            }
            if (senderTelephone == '') {
                alertify.error('Please input Sender Phone.');
                $('[name="senderTelephone"]').css('border-color', 'red');
                return false;
            }
            if (receiverId == '') {
                alertify.error('Please input receiver.');
                $('[name="receiverId"]').css('border-color', 'red');
                return false;
            }
            if (receiverTelephone == '') {
                alertify.error('Please input receiver phone.');
                $('[name="receiverTelephone"]').css('border-color', 'red');
                return false;
            }
        }
    },
    'change [name="promotionId"]'(e, instance){
        let promotionId = $(e.currentTarget).val();
        let transferDate = instance.$('[name="transferDate"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let amount = instance.$('[name="amount"]').val();
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
        if (promotionId && transferDate && customerFee) {
            Meteor.call('newPromotion', promotionId, transferDate, customerFee, function (error, result) {
                if (result) {
                    state.set('promotionAmount', result);
                    let sumTotalFeeTotalAmount = new BigNumber(customerFee).minus(new BigNumber(result)).toFixed(2);
                    let totalAmount = calculateTotalAmount(amount, sumTotalFeeTotalAmount);
                    state.set('promotion', sumTotalFeeTotalAmount);
                    tmpCollection.update({}, {$set: {totalFee: sumTotalFeeTotalAmount, totalAmount: totalAmount}});
                } else {
                    state.set('promotionAmount', '');
                    state.set('promotion', 0);
                }
            });
        }
        // else {
        //     state.set('promotion', 0);
        // }
    },
    'keypress [name="amount"],[name="discountFee"],[name="sellingFirst"],[name="baseAmountFirst"],[name="sellingSecond"],[name="baseAmountSecond"]'(evt, instance){
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'click [name="transferType"]'(e, instance){
        let transferType = $(e.currentTarget).val();
        let transferDate = instance.$('[name="transferDate"]').val();
        let amount = instance.$('[name="amount"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let bothBaseAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
        let totalAmount = new BigNumber(amount).minus(new BigNumber(bothBaseAmount)).toFixed(2);
        //let totalAmountThai = new BigNumber(amount).add(new BigNumber(bothBaseAmount)).toFixed(2);
        Session.set('transferType', transferType);
        if (transferType == "khmer") {
            instance.$('[name="discountFee"]').prop('readonly', true);
            instance.$('[name="discountFee"]').val(0);
            tmpCollection.update({}, {$set: {totalFee: customerFee, totalAmount: totalAmount}});
            $('.hide-show').slideUp(300);
            style = "display: none;"
        } else {
            instance.$('[name="discountFee"]').prop('readonly', false);
            //tmpCollection.update({}, {$set: {totalFee: customerFee, totalAmount: totalAmountThai}});
            Meteor.call('promotionLabel', transferDate, function (error, result) {
                if (result) {
                    state.set('promotionLabel', 'Promotion');
                }
                state.set('promotionLabel', "None Promotion");
                $('.hide-show').slideDown(300);

            });
        }
        //AutoForm.resetForm('MoneyTransfer_transferForm');
        tmpCollection.remove({});
        clearOnSuccess();
    },
    'click [name="type"]'(e, instance){
        let type = instance.$("input:radio[name=type]:checked").val();
        let amount = instance.$('[name="amount"]').val();
        amount = _.isEmpty(amount) ? 0 : parseFloat(amount);
        let customerFee = instance.$('[name="customerFee"]').val();
        let totalFee = instance.$('[name="totalFee"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();

        //let totalOnlyAmountDiscount = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
        let totalExchangeAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);

        // let totalNoFee = new BigNumber(amount).minus(new BigNumber(totalExchangeAmount)).minus(new BigNumber(totalOnlyAmountDiscount)).toFixed(2);
        let totalNoFee = new BigNumber(amount).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
        let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
        let totalAmountThaiIn = new BigNumber(amount).minus(new BigNumber(totalFee)).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
        let totalAmountThaiOut = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(totalExchangeAmount)).toFixed(2);

        if (transferType == "khmer") {
            if (type == "IN") {
                tmpCollection.update({}, {$set: {totalAmount: totalNoFee}});
            } else if (type == "OUT") {
                tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
            }
        } else {
            if (type == "IN") {
                tmpCollection.update({}, {$set: {totalAmount: totalAmountThaiIn}});
            } else if (type == "OUT") {
                tmpCollection.update({}, {$set: {totalAmount: totalAmountThaiOut}});
            }
        }

    },
    'change [name="senderId"]'(e, instance){
        let senderId = $(e.currentTarget).val();
        Session.set('senderId', {senderId});

    },
    'change [name="receiverId"]'(e, instance){
        let receiverId = $(e.currentTarget).val();
        Session.set('receiverId', {receiverId});
    },
    'change [name="productId"]'(e, instance){
        let productId = $(e.currentTarget).val();
        Session.set("productId", productId);
        $('[name="currencyId"]').val('');
        clearOnchange();
        tmpCollection.remove({});

        Meteor.call("getCurrency", productId, function (error, result) {
            if (result) {
                //instance.currencyList.set(result);
                state.set('currencyList', result);
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
        } else if (currencyId == 'THB') {
            symbol = 'B'
        }
        state.set("promotion", 0);
        Session.set("currencyId", currencyId);
        Session.set("currencySymbol", symbol);
        if (Session.get("productId") && currencyId) {
            Meteor.call("checkValidateDepositWithdrawal", Session.get("productId"), currencyId, function (error, result) {
                if (result) {
                    instance.$('.save').prop('disabled', false);
                    instance.$('.save-print').prop('disabled', false);
                } else {
                    instance.$('.save').prop('disabled', true);
                    instance.$('.save-print').prop('disabled', true);
                    instance.$('[name="amount"]').prop("readonly", true);
                    displayError("You are not yet deposit amount!");
                }
            });
        }
        if (currencyId) {
            Meteor.call("exchangeTransfer", currencyId, function (err, res) {
                state.set('exchangeId', res.exchangeId);
                state.set('exchangeTransfer', res.exchangeTransfer);
            });
        }
        clearOnchange();
        clearOnKeyupAmount();
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
        let customerFee = instance.$("[name='customerFee']").val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();
        let totalExchangeAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
        if (amount == "") {
            clearOnKeyupAmount();
        }
        Session.set("amount", amount);
        readOnlyFalse();
        if (productId && currencyId && amount && type) {
            Meteor.call("getFee", productId, currencyId, amount, type, function (error, result) {
                if (result) {
                    tmpCollection.remove({});
                    tmpCollection.insert(result);
                    let totalAmountPri = calculateTotalAmount(amount, result.customerFee);
                    let totalAmount = new BigNumber(totalAmountPri).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
                    let totalAmountThaiIn = new BigNumber(amount).minus(new BigNumber(result.customerFee)).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
                    //let typeIn = new BigNumber(amount).minus(new BigNumber(customerFee)).toFixed(2);
                    //Session.set("totalAmount", totalAmount);

                    if (transferType == 'khmer') {
                        if (type == "IN") {
                            tmpCollection.update({}, {$set: {totalAmount: amount}});
                        } else if (type == "OUT") {
                            tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                        }
                    } else {
                        if (type == "IN") {
                            tmpCollection.update({}, {$set: {totalAmount: totalAmountThaiIn}});
                        } else if (type == "OUT") {
                            tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                        }
                    }

                    instance.$('.save').prop('disabled', false);
                    instance.$('.save-print').prop('disabled', false);
                    instance.$('[name="baseAmountFirst"]').val(0);
                    //, feeDoc: result
                } else {
                    instance.$('.save').prop('disabled', true);
                    instance.$('.save-print').prop('disabled', true);
                    displayError("Your balance are exceeded of fee");
                }
            });

        }

        //baseAmount 2
    },
    'keyup [name="discountFee"]'(e, instance){
        let discountFee = $(e.currentTarget).val();
        let amount = instance.$('[name="amount"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();

        let bothBaseAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
        let totalFee = calculateAfterDiscount(customerFee, discountFee);
        let totalAfterDis = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
        if (transferType == "khmer") {
            if (type == "IN") {
                let totalAmount = new BigNumber(amount).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFee, totalAmount: totalAmount}});
            } else {
                let totalAmount = new BigNumber(amount).add(new BigNumber(customerFee)).minus(new BigNumber(totalAfterDis)).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFee, totalAmount: totalAmount}});
            }
        } else {
            if (type == "IN") {
                let thaiIn = new BigNumber(amount).minus(new BigNumber(customerFee)).toFixed(2);
                let totalAmount = new BigNumber(thaiIn).add(new BigNumber(totalAfterDis)).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFee, totalAmount: totalAmount}});
            } else {
                let thaiOut = new BigNumber(amount).add(new BigNumber(customerFee)).toFixed(2);
                let totalAmount = new BigNumber(thaiOut).minus(new BigNumber(totalAfterDis)).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFee, totalAmount: totalAmount}});
            }
        }

    },
    'click .js-print'(e, instance){
        Session.set("savePrint", true);
    },

    'click .sender' (e, instance) {
        Session.set('quickAddCustomerFlag', 'sender');
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    },
    'click .receiver' (e, instance) {
        Session.set('quickAddCustomerFlag', 'receiver');
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    },
    // 'click [name="deductFee"]'(e, instance){
    //     // UIBlock.block('Wait...');
    //     $.blockUI();
    //     Meteor.setTimeout(()=> {
    //         UIBlock.unblock();
    //         let deductFee = $(e.currentTarget).prop('checked');
    //         let amount = instance.$('[name="amount"]').val();
    //         let customerFee = instance.$('[name="customerFee"]').val();
    //         let productId = instance.$('[name="productId"]').val();
    //         let currencyId = instance.$('[name="currencyId"]').val();
    //         //selling rate 1
    //         let type = instance.$("input:radio[name=type]:checked").val();
    //         let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
    //         let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
    //         let totalFee = instance.$('[name="totalFee"]').val();
    //         let discountAmount = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
    //         let exchangeAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
    //         let totalDiscountAmountExchangeAmount = new BigNumber(discountAmount).add(new BigNumber(exchangeAmount)).toFixed(2);
    //
    //         if (deductFee == true) {
    //             let amountDeductFee = new BigNumber(amount).minus(new BigNumber(customerFee)).toFixed(2);
    //             if (productId && currencyId && amount) {
    //                 Meteor.call("getFee", productId, currencyId, amountDeductFee, type, function (error, result) {
    //                     if (result) {
    //                         if (type == 'IN') {
    //                             tmpCollection.remove({});
    //                             tmpCollection.insert(result);
    //                             let totalAmountPri = new BigNumber(amount).minus(new BigNumber(result.customerFee)).toFixed(2);
    //                             let totalAmount = new BigNumber(totalAmountPri).minus(new BigNumber(totalDiscountAmountExchangeAmount)).toFixed(2);
    //                             instance.amount.set(totalAmount);
    //                             tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
    //                             instance.$('.save').prop('disabled', false);
    //                             instance.$('.save-print').prop('disabled', false);
    //                         } else {
    //                             tmpCollection.remove({});
    //                             tmpCollection.insert(result);
    //                             let totalAmountPri = new BigNumber(amount).minus(new BigNumber(result.customerFee)).toFixed(2);
    //                             let totalAmount = new BigNumber(totalAmountPri).minus(new BigNumber(totalDiscountAmountExchangeAmount)).toFixed(2);
    //                             instance.amount.set(totalAmountPri);
    //                             tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
    //                             instance.$('.save').prop('disabled', false);
    //                             instance.$('.save-print').prop('disabled', false);
    //                         }
    //                     }
    //
    //                 });
    //             }
    //         } else {
    //             let amountDeductFee = new BigNumber(amount).add(new BigNumber(customerFee)).toFixed(2);
    //             if (amount == "") {
    //                 clearOnKeyupAmount();
    //             }
    //             if (productId && currencyId && amount) {
    //                 Meteor.call("getFee", productId, currencyId, amountDeductFee, type, function (error, result) {
    //                     if (result) {
    //                         if (type == 'IN') {
    //                             tmpCollection.remove({});
    //                             tmpCollection.insert(result);
    //                             //let totalAmountPri = new BigNumber(amountDeductFee).add(new BigNumber(result.customerFee)).toFixed(2);
    //                             let totalAmount = new BigNumber(amountDeductFee).minus(new BigNumber(totalDiscountAmountExchangeAmount)).toFixed(2);
    //                             instance.amount.set(amountDeductFee);
    //                             tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
    //                             instance.$('.save').prop('disabled', false);
    //                             instance.$('.save-print').prop('disabled', false);
    //                         } else {
    //                             tmpCollection.remove({});
    //                             tmpCollection.insert(result);
    //                             let totalAmountPri = new BigNumber(amountDeductFee).add(new BigNumber(result.customerFee)).toFixed(2);
    //                             let totalAmount = new BigNumber(totalAmountPri).minus(new BigNumber(totalDiscountAmountExchangeAmount)).toFixed(2);
    //                             instance.amount.set(amountDeductFee);
    //                             tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
    //                             instance.$('.save').prop('disabled', false);
    //                             instance.$('.save-print').prop('disabled', false);
    //                         }
    //                     }
    //
    //                 });
    //             }
    //         }
    //         $.unblockUI();
    //     }, 200);
    // },
    'change [name="baseAmountFirst"]'(e, instance){
        let baseAmountFirst = $(e.currentTarget).val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToFirst = instance.$('[name="convertToFirst"]').val();
        let productId = instance.$('[name="productId"]').val();
        let amount = instance.$('[name="amount"]').val();
        let sellingFirst = instance.$('[name="sellingFirst"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let totalFee = instance.$('[name="totalFee"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();

        //selling rate 1
        if (currencyId && convertToFirst && baseAmountFirst && sellingFirst) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToFirst, baseAmountFirst, sellingFirst, function (error, res) {
                state.set("toAmountFirst", res);
            });
        }
        //baseAmount input 2
        if (currencyId && convertToFirst && baseAmountFirst) {
            baseAmountFirst = baseAmountFirst ? baseAmountFirst : 0;
            baseAmountSecond = baseAmountSecond ? baseAmountSecond : 0;
            let totalFeeAfterDis = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
            let bothBaseAmountFirstIn = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
            let bothBaseAmountFirstOut = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).add(new BigNumber(totalFeeAfterDis)).toFixed(2);
            if (transferType == 'khmer') {
                if (type == "IN") {
                    let resultAmountFirst = new BigNumber(amount).minus(new BigNumber(bothBaseAmountFirstIn)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('toAmountFirst', res);
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).toFixed(2);
                    let resultAmountFirst = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountFirstOut)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('toAmountFirst', res);
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                }
            } else {
                if (type == "IN") {
                    let totalSubtract = new BigNumber(customerFee).add(new BigNumber(bothBaseAmountFirstIn)).toFixed(2);
                    let resultAmountFirst = new BigNumber(amount).add(new BigNumber(totalFeeAfterDis)).minus(new BigNumber(totalSubtract)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('toAmountFirst', res);
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(bothBaseAmountFirstIn)).toFixed(2);
                    //let resultAmountFirst = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountFirstOut)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('toAmountFirst', res);
                        tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                    });
                }
            }

        }

    },
    'change [name="baseAmountSecond"]'(e, instance){
        let baseAmountSecond = $(e.currentTarget).val();
        let baseAmountFirst = $('[name="baseAmountFirst"]').val();
        let totalFee = instance.$('[name="totalFee"]').val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToSecond = instance.$('[name="convertToSecond"]').val();
        let productId = instance.$('[name="productId"]').val();
        let amount = instance.$('[name="amount"]').val();
        let sellingSecond = instance.$('[name="sellingSecond"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();

        //selling rate 2
        if (currencyId && convertToSecond && baseAmountSecond && sellingSecond) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToSecond, baseAmountSecond, sellingSecond, function (error, res) {
                state.set('toAmountSecond', res);
            });
        }
        //base amount 2
        if (currencyId && convertToSecond && baseAmountSecond) {
            baseAmountSecond = baseAmountSecond ? baseAmountSecond : 0;
            baseAmountFirst = baseAmountFirst ? baseAmountFirst : 0;
            let totalFeeAfterDis = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
            let bothBaseAmountSecondIn = new BigNumber(baseAmountSecond).add(new BigNumber(baseAmountFirst)).toFixed(2);
            let bothBaseAmountSecondOut = new BigNumber(baseAmountSecond).add(new BigNumber(baseAmountFirst)).add(new BigNumber(totalFeeAfterDis)).toFixed(2);
            if (transferType == 'khmer') {
                if (type == 'IN') {
                    let resultAmountSecond = new BigNumber(amount).minus(new BigNumber(bothBaseAmountSecondIn)).toFixed(2);
                    tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('toAmountSecond', res);
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).toFixed(2);
                    let resultAmountSecond = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountSecondOut)).toFixed(2);
                    tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('toAmountSecond', res);
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    });
                }
            } else {
                if (type == 'IN') {
                    let thaiIn = new BigNumber(customerFee).add(new BigNumber(bothBaseAmountSecondIn)).toFixed(2);
                    let totalThaiIn = new BigNumber(amount).add(new BigNumber(totalFeeAfterDis)).minus(new BigNumber(thaiIn)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('toAmountSecond', res);
                        tmpCollection.update({}, {$set: {totalAmount: totalThaiIn}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(bothBaseAmountSecondIn)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('toAmountSecond', res);
                        tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                    });
                }
            }


        }
    },
    'change [name="sellingFirst"]'(e, instance){
        let sellingFirst = $(e.currentTarget).val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToFirst = instance.$('[name="convertToFirst"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        if (currencyId && convertToFirst && baseAmountFirst && sellingFirst) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToFirst, baseAmountFirst, sellingFirst, function (error, res) {
                state.set("toAmountFirst", res);
            });
        }
    },
    'change [name="sellingSecond"]'(e, instance){
        let sellingSecond = $(e.currentTarget).val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToSecond = instance.$('[name="convertToSecond"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        if (currencyId && convertToSecond && baseAmountSecond && sellingSecond) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToSecond, baseAmountSecond, sellingSecond, function (error, res) {
                state.set('toAmountSecond', res);
            });

        }
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
            // let items = {};
            // let data = exchangeItemCollection.find().fetch();
            // data.forEach(function (obj) {
            //     //if (obj != undefined) {
            //     //delete obj._id;
            //
            //     _id = obj._id,
            //         baseCurrency = obj.baseCurrency,
            //         selling = obj.sellingSecond,
            //         convertTo = obj.convertToSecond,
            //         baseAmount = obj.baseAmountSecond,
            //         toAmount = obj.toAmount
            //
            //     //}
            // });
            // doc.items = items;
            //doc.items = exchangeItemCollection.find().fetch();
            return doc;
        },
        // ,
        update(doc){
            doc.$set.feeDoc = tmpCollection.findOne();
            //doc.$set.items = exchangeItemCollection.find().fetch();
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
                tmpCollection.remove({});
                // exchangeItemCollection.remove({});
            }
        } else {
            if (Session.get("savePrint")) {
                Meteor.call('invoice', result, function (err, doc) {
                    alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc));
                });
            }
            tmpCollection.remove({});
            state.set('toAmountFirst', 0);
            state.set('toAmountSecond', 0);
            state.set("exchangeTransfer", 0);
            state.set('exchangeId', null);

        }

        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
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
    $('[name="baseAmountFirst"]').val(0);
    $('[name="baseAmountSecond"]').val(0);
    $('[name="toAmountFirst"]').val(0);
    $('[name="toAmountSecond"]').val(0);
}
function readOnlyFalse() {
    $('[name="sellingFirst"]').prop("readonly", false);
    $('[name="sellingSecond"]').prop("readonly", false);
    $('[name="baseAmountFirst"]').prop("readonly", false);
    $('[name="baseAmountSecond"]').prop("readonly", false);
}
function exchangeClear() {
    $('[name="baseAmountFirst"]').val(0);
    $('[name="baseAmountSecond"]').val(0);
    $('[name="toAmountFirst"]').val(0);
    $('[name="toAmountSecond"]').val(0);
}
function clearOnSuccess() {
    $('[name="customerFee"]').val(0);
    $('[name="discountFee"]').val(0);
    $('[name="amount"]').val(0);
    $('[name="totalFee"]').val(0);
    $('[name="totalAmount"]').val(0);
    $('[name="baseAmountFirst"]').val(0);
    $('[name="baseAmountSecond"]').val(0);
    $('[name="toAmountFirst"]').val(0);
    $('[name="toAmountSecond"]').val(0);
    $('[name="senderTelephone"]').val('');
    $('[name="receiverTelephone"]').val('');
    $('[name="promotionId"]').val('');

}
function calculateAfterDiscount(customerFee, discountFee) {
    //return customerFee * (1 - discountFee / 100);
    return new BigNumber(customerFee).times(new BigNumber(new BigNumber(1).minus(new BigNumber(discountFee).div(new BigNumber(100))))).toFixed(2);
    //return new BigNumber(customerFee).times(new BigNumber(1).minus(new BigNumber(discountFee)).div(new BigNumber(100))).toFixed(2);
}
function calculateTotalAmount(amount, disAmountFee) {
    return new BigNumber(amount).add(new BigNumber(disAmountFee)).toFixed(2);
}
