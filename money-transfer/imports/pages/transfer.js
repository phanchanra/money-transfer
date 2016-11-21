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
import {Promotion} from '../../common/collections/promotion';
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
Session.setDefault('transferDate', moment().toDate());
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
    toAmountFirst: 0,
    toAmountSecond: 0,
    exchangeTransfer: '',
    currencyList: '',
    promotionLabel: '',
    promotion: {},
    promotionAmount: 0,
    promotionId: '',
    customerFee: 0,
    exchangeId: '',
    senderPhone: '',
    receiverPhone: '',
    bankName: '',
    bankNumber: '',
    exToAmountBuyingFirst: 0,
    exToAmountBuyingSecond: 0,
    resultIncomeAmountFirst: 0,
    resultIncomeAmountSecond: 0
    //transferDate: ''
});
invoice.helpers({
    userName(){
        return Meteor.user().profile.name;
    }
});
indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.transfer(fa('plus', 'Transfer'), renderTemplate(formTmpl)).maximize();
    },
    'click .js-update' (event, instance) {
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
                instance.$('[name="amount"]').prop("readonly", true);
            } else {
                instance.$('[name="amount"]').prop("readonly", true);
            }
        });
        //
        Session.set("transferId", this._id);
        Session.set('transferType', this.transferType);
        Session.set('typeInOut', this.type);
        state.set("promotionId", this.promotionId);
        Session.set('transferDate', this.transferDate);
        Session.set('productId', this.productId);
        //state.set('customerFee', this.customerFee);
        state.set('bankName', this.bankName);
        state.set('bankNumber', this.bankNumber);
        state.set('senderPhone', this.senderTelephone);
        state.set('receiverPhone', this.receiverTelephone);

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
                alertify.transfer(fa('pencil', 'Transfer'), renderTemplate(formTmpl, this)).maximize();
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
            alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc)).maximize();
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
    this.currencyList = new ReactiveVar();
    this.amount = new ReactiveVar();
    this.autorun(()=> {
        let currentData = Template.currentData();
        let senderDoc = Session.get('senderId');
        let receiverDoc = Session.get('receiverId');
        Meteor.subscribe("moneyTransfer.promotionById", {date: Session.get('transferDate')});
        //console.log(Promotion.find().fetch());
        if (currentData) {
            this.subscribe('moneyTransfer.transferById', currentData._id);
        }
        if (senderDoc) {
            if (senderDoc.telephone && senderDoc.flag == 'sender') {
                state.set('senderPhone', senderDoc.telephone);
            } else if (senderDoc.telephone && senderDoc.flag == 'receiver') {
                state.set('receiverPhone', senderDoc.telephone);
                state.set('bankName', senderDoc.bankName);
                state.set('bankNumber', senderDoc.bankNumber);

            } else {
                Meteor.call("getCustomerInfo", senderDoc.senderId, (error, result) => {
                    state.set('senderPhone', result.telephone);
                });
            }
        }
        if (receiverDoc) {
            Meteor.call("getCustomerInfo", receiverDoc.receiverId, (err, res) => {
                state.set('receiverPhone', res.telephone);
                state.set('bankName', res.bankName);
                state.set('bankNumber', res.bankNumber);
            });
        }

    });
    Session.set("type", false);
});
// Form
formTmpl.onRendered(function () {
    let transferDate = $('[name="transferDate"]');
    transferDate.on("dp.change", function (e) {
        Session.set('transferDate', moment(e.date).toDate());
    });
    if (Session.get('currencyId')) {
        $('[name="amount"]').prop("readonly", true);
    }
    //Session.set('transferType', $('[name="transferType"]').val());

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
            //when update
            if (Session.get('transferType') == 'thai') {
                $('[name="customerFee"]').prop("readonly", false);
            } else {
                $('[name="customerFee"]').prop("readonly", true);
                $('.promotion-hide-show').hide('fast');
                //$('[name="amount"]').prop("readonly", true);
            }
            if (Session.get('transferType') == 'thai' && Session.get('typeInOut') == 'OUT') {
                $(".show-hide-bank").show('fast');
            }
            Meteor.call("getCurrency", Session.get('productId'), function (error, result) {
                if (result) {
                    state.set('currencyList', result);
                    $('[name="amount"]').prop("readonly", false);
                } else {
                    $('[name="amount"]').prop("readonly", true);
                }
            });
            // Meteor.call('promotionLabel', Session.get('transferDate'), function (error, result) {
            //     if (result) {
            //         state.set('promotionLabel', 'Promotion');
            //     } else {
            //         state.set('promotionLabel', "None Promotion");
            //     }
            // });
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
        return state.get('senderPhone');
    },
    receiverPhone(){
        return state.get('receiverPhone');
    },
    bankName(){
        return state.get('bankName');
    },
    bankNumber(){
        return state.get('bankNumber');
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
    exchangeTransferLabelFirst(){
        if (Session.get('currencyId')) {
            try {
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
                let exchangeTransfer = state.get("exchangeTransfer");
                let exchangeLabelSecond = exchangeTransfer ? exchangeTransfer[1] : undefined;
                if (exchangeLabelSecond) {
                    return exchangeLabelSecond.convertTo;
                }
            } catch (e) {
            }
        }
    },
    exchangeFirstBuy(){
        if (Session.get('currencyId')) {
            try {
                let exchangeTransferFirstBuy = state.get("exchangeTransfer");
                let exchangeFormFirstBuy = exchangeTransferFirstBuy ? exchangeTransferFirstBuy[0] : undefined;
                if (exchangeFormFirstBuy) {
                    return exchangeFormFirstBuy.buying;
                }
            } catch (e) {
            }
        }
    },
    exchangeSecondBuy(){
        if (Session.get('currencyId')) {
            try {
                let exchangeTransferSecondBuy = state.get("exchangeTransfer");
                let exchangeFormSecondBuy = exchangeTransferSecondBuy ? exchangeTransferSecondBuy[1] : undefined;
                if (exchangeFormSecondBuy) {
                    return exchangeFormSecondBuy.buying;
                }
            } catch (e) {

            }
        }
    },
    toAmountFirstBuy(){
        let exToAmountBuyingFirst = state.get('exToAmountBuyingFirst');
        if (exToAmountBuyingFirst) {
            return exToAmountBuyingFirst;
        }
    },
    toAmountSecondBuy(){
        let exToAmountBuyingSecond = state.get('exToAmountBuyingSecond');
        if (exToAmountBuyingSecond) {
            return exToAmountBuyingSecond;
        }
    },
    resultIncomeAmountFirst(){
        let resultIncomeAmountFirst = state.get('resultIncomeAmountFirst');
        if (resultIncomeAmountFirst) {
            return resultIncomeAmountFirst;
        }
    },
    resultIncomeAmountSecond(){
        let resultIncomeAmountSecond = state.get('resultIncomeAmountSecond');
        if (resultIncomeAmountSecond) {
            return resultIncomeAmountSecond;
        }
    },
    exchangeTransferFormFirst(){
        if (Session.get('currencyId')) {
            try {
                let exchangeTransferFirst = state.get("exchangeTransfer");
                let exchangeFormFirst = exchangeTransferFirst ? exchangeTransferFirst[0] : undefined;
                if (exchangeFormFirst) {
                    return exchangeFormFirst.selling;
                }
            } catch (e) {
            }
        }
    },
    exchangeTransferFormSecond(){
        if (Session.get('currencyId')) {
            try {
                let exchangeTransferSecond = state.get("exchangeTransfer");
                let exchangeFormSecond = exchangeTransferSecond ? exchangeTransferSecond[1] : undefined;
                if (exchangeFormSecond) {
                    return exchangeFormSecond.selling;
                }
            } catch (e) {

            }
        }
    },
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
    promotionLabel(){
        return state.get('promotionLabel');
    },
    promotionAmount(){
        return state.get('promotionAmount');
    },
    promotion(){
        return state.get('promotion');
    },
    promotionList(){
        let arr = [{label: '(Select One)', value: ''}];
        let promotions = Promotion.find({});
        promotions.forEach(function (promotion) {
            arr.push({label: `${promotion._id} | ${promotion.name}(${promotion.type})`, value: promotion._id});
        });
        return arr;
    },
    refCode(){
        let refCode = Session.get('refCode');
        if (refCode != '') {
            return refCode;
        } else {
            return '';
        }
    },
    typeValidate(){
        let typeValidate = Session.get('typeValidate');
        if (typeValidate) {
            return typeValidate;
        }
        return '';
    },
    dateNote(){
        let dateNote = Session.get('dateNote');
        if (dateNote) {
            return dateNote;
        }
        return '';
    },
    timeNote(){
        let timeNote = Session.get('timeNote');
        if (timeNote) {
            return timeNote;
        }
        return '';
    },
    senderIdValidate(){
        let senderIdValidate = Session.get('senderIdValidate');
        if (senderIdValidate) {
            return senderIdValidate;
        }
        return '';
    },
    senderValidatePhone(){
        let senderValidatePhone = Session.get('senderValidatePhone');
        if (senderValidatePhone) {
            return senderValidatePhone;
        }
    },
    receiverIdValidate(){
        let receiverIdValidate = Session.get('receiverIdValidate');
        if (receiverIdValidate) {
            return receiverIdValidate;
        }
        return '';
    },
    receiverValidatePhone(){
        let receiverValidatePhone = Session.get('receiverValidatePhone');
        if (receiverValidatePhone) {
            return receiverValidatePhone;
        }
        return '';
    },
    //
    productIdValidate(){
        let productIdValidate = Session.get('productIdValidate');
        if (productIdValidate) {
            return productIdValidate;
        }
        return '';
    },
    currencyIdValidate(){
        let currencyIdValidate = Session.get('currencyIdValidate');
        if (currencyIdValidate) {
            return currencyIdValidate;
        }
        return '';
    },
    amountValidate(){
        let amountValidate = Session.get('amountValidate');
        if (amountValidate) {
            return amountValidate;
        }
        return '';
    },
    bankNameValidate(){
        let bankNameValidate = Session.get('bankNameValidate');
        if (bankNameValidate) {
            return bankNameValidate;
        }
    },
    bankNumberValidate(){
        let bankNumberValidate = Session.get('bankNumberValidate');
        if (bankNumberValidate) {
            return bankNumberValidate;
        }
    }
});
formTmpl.onDestroyed(function () {
    Session.set('senderId', undefined);
    Session.set('receiverId', undefined);
    state.set('bankName', undefined);
    state.set('bankNumber', undefined);
    state.set('senderPhone', undefined);
    state.set('receiverPhone', undefined);
    Session.set('typeValidate', null);
    Session.set('refCode', null);
    Session.set('dateNote', null);
    Session.set('timeNote', null);
    Session.set('senderIdValidate', null);
    Session.set('senderValidatePhone', null);
    Session.set('receiverIdValidate', null);
    Session.set('receiverValidatePhone', null);
    Session.set('productIdValidate', null);
    Session.set('currencyIdValidate', null);
    Session.set('amountValidate', null);
    Session.set('bankNameValidate', null);
    Session.set('bankNumberValidate', null);
    Session.set("savePrint", false);
    tmpCollection.remove({});
    state.set('exToAmountBuyingSecond', null);
    state.set('toAmountSecond', null);
    state.set('resultIncomeAmountSecond', null);
    state.set('exToAmountBuyingFirst', null);
    state.set('toAmountFirst', null);
    state.set('resultIncomeAmountFirst', null);
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
        if ($('[name="type"]:checked').length > 0) {
            Session.set('typeValidate', null);
        }
        Session.set('dateNote', null);
        Session.set('timeNote', null);
        Session.set('refCode', null);
        Session.set('senderValidatePhone', null);
        Session.set('receiverValidatePhone', null);
        Session.set('amountValidate', '');
        Session.set('bankNameValidate', null);
        Session.set('bankNumberValidate', null);
    },
    'click #save'(e, instance){
        debugger;
        let type = $('input:radio[name=type]:checked').val();
        let transferType = $('input:radio[name=transferType]:checked').val();
        let dateNote = instance.$('[name="dateNote"]').val();
        let timeNote = instance.$('[name="timeNote"]').val();
        let refCode = instance.$('[name="refCode"]').val();
        let senderId = instance.$('[name="senderId"]').val();
        let senderTelephone = instance.$('[name="senderTelephone"]').val();
        let receiverId = instance.$('[name="receiverId"]').val();
        let receiverTelephone = instance.$('[name="receiverTelephone"]').val();
        let productId = instance.$('[name="productId"]').val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let amount = instance.$('[name="amount"]').val();
        let bankName = instance.$('[name="bankName"]').val();
        let bankNumber = instance.$('[name="bankNumber"]').val();
        if (transferType == 'khmer') {
            if (type == 'OUT') {
                if (senderId == '' || senderTelephone == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('refCode', 'This field is required!');
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('senderIdValidate', 'This field is required!');
                    Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');
                    return false;
                }
            } else {
                if (refCode == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('refCode', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');
                    return false;
                }
            }
        } else {
            if (type == 'IN') {
                if (type == '' || dateNote == '' || timeNote == '' || senderId == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('dateNote', 'This field is required!');
                    Session.set('timeNote', 'This field is required!');
                    Session.set('senderIdValidate', 'This field is required!');
                    Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');

                    return false;
                }
            } else {
                if (type == '' || dateNote == '' || receiverId == '' || productId == '' || currencyId == '' || amount == '' || bankName == '' || bankNumber == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('dateNote', 'This field is required!');
                    //Session.set('timeNote', 'This field is required!');
                    //Session.set('senderIdValidate', 'This field is required!');
                    //Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    //Session.set('receiverValidatePhone', 'This field is required!');
                    Session.set('bankNameValidate', 'This field is required!');
                    Session.set('bankNumberValidate', 'This field is required!');
                    return false;
                }
            }

        }
    },
    'click #save-print'(e, instance){
        Session.set("savePrint", true);
        let type = $('input:radio[name=type]:checked').val();
        let transferType = $('input:radio[name=transferType]:checked').val();
        let dateNote = instance.$('[name="dateNote"]').val();
        let timeNote = instance.$('[name="timeNote"]').val();
        let refCode = instance.$('[name="refCode"]').val();
        let senderId = instance.$('[name="senderId"]').val();
        let senderTelephone = instance.$('[name="senderTelephone"]').val();
        let receiverId = instance.$('[name="receiverId"]').val();
        let receiverTelephone = instance.$('[name="receiverTelephone"]').val();
        let productId = instance.$('[name="productId"]').val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let amount = instance.$('[name="amount"]').val();
        if (transferType == 'khmer') {
            if (type == 'OUT') {
                if (senderId == '' || senderTelephone == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('senderIdValidate', 'This field is required!');
                    Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');
                    return false;
                }
            } else {
                if (refCode == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('refCode', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');
                    return false;
                }
            }
        } else {
            if (type == 'IN') {
                if (type == '' || dateNote == '' || timeNote == '' || senderId == '' || receiverId == '' || receiverTelephone == '' || productId == '' || currencyId == '' || amount == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('dateNote', 'This field is required!');
                    Session.set('timeNote', 'This field is required!');
                    Session.set('senderIdValidate', 'This field is required!');
                    Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    Session.set('receiverValidatePhone', 'This field is required!');
                    return false;
                }
            } else {
                if (type == '' || dateNote == '' || receiverId == '' || productId == '' || currencyId == '' || amount == '' || bankName == '' || bankNumber == '') {
                    Session.set('productIdValidate', 'This field is required!');
                    Session.set('currencyIdValidate', 'This field is required!');
                    Session.set('amountValidate', 'This field is required!');
                    Session.set('typeValidate', 'This field is required!');
                    Session.set('dateNote', 'This field is required!');
                    //Session.set('timeNote', 'This field is required!');
                    //Session.set('senderIdValidate', 'This field is required!');
                    //Session.set('senderValidatePhone', 'This field is required!');
                    Session.set('receiverIdValidate', 'This field is required!');
                    //ession.set('receiverValidatePhone', 'This field is required!');
                    Session.set('bankNameValidate', 'This field is required!');
                    Session.set('bankNumberValidate', 'This field is required!');
                    return false;
                }
            }
        }
    },

    'change [name="promotionId"]'(e, instance){
        let promotionId = $(e.currentTarget).val();
        let transferDate = Session.get('transferDate');
        // let transferDate = instance.$('[name="transferDate"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let discountFee = instance.$('[name="discountFee"]').val();
        let amount = instance.$('[name="amount"]').val();
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
        let type = instance.$("input:radio[name=type]:checked").val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let totalFee = calculateAfterDiscount(customerFee, discountFee);
        let totalAfterDis = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
        let sumTotalFeeTotalAmount = 0;
        let totalAmount = 0;
        let bothBaseAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
        let totalBaseAmountFeeIn = new BigNumber(bothBaseAmount).add(new BigNumber(customerFee)).toFixed(2);

        if (promotionId && transferDate && customerFee) {
            Meteor.call('newPromotion', promotionId, transferDate, customerFee, function (error, result) {
                if (result) {
                    if (type == 'IN') {
                        let totalProAndDis = new BigNumber(totalAfterDis).add(new BigNumber(result)).toFixed(2);
                        sumTotalFeeTotalAmount = new BigNumber(customerFee).minus(new BigNumber(totalProAndDis)).toFixed(2);
                        totalAmount = new BigNumber(amount).add(new BigNumber(totalProAndDis)).minus(new BigNumber(totalBaseAmountFeeIn)).toFixed(2);
                    } else {
                        sumTotalFeeTotalAmount = new BigNumber(customerFee).minus(new BigNumber(result)).toFixed(2);
                        let feeAndBaseAmount = new BigNumber(result).add(new BigNumber(bothBaseAmount)).add(new BigNumber(totalAfterDis)).toFixed(2);
                        totalAmount = new BigNumber(amount).add(new BigNumber(customerFee)).minus(new BigNumber(feeAndBaseAmount)).toFixed(2);
                    }
                    state.set('promotionAmount', result);
                    state.set('promotion', sumTotalFeeTotalAmount);
                    tmpCollection.update({}, {$set: {totalFee: sumTotalFeeTotalAmount, totalAmount: totalAmount}});
                } else {
                    state.set('promotionAmount', '');
                    state.set('promotion', 0);
                }
            });
        }
        else {
            state.set('promotion', 0);
        }
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
        Session.set('typeValidate', null);
        Session.set('refCode', null);
        Session.set('dateNote', null);
        Session.set('timeNote', null);
        Session.set('senderIdValidate', null);
        Session.set('senderValidatePhone', null);
        Session.set('receiverIdValidate', null);
        Session.set('receiverValidatePhone', null);
        Session.set('productIdValidate', null);
        Session.set('currencyIdValidate', null);
        Session.set('amountValidate', null);
        Session.set('bankNameValidate', null);
        Session.set('bankNumberValidate', null);
        let transferType = $(e.currentTarget).val();
        let type = instance.$("input:radio[name=type]:checked").val();
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
            instance.$('[name="customerFee"]').prop('readonly', true);
            instance.$('[name="discountFee"]').prop('readonly', true);
            instance.$('[name="discountFee"]').val(0);
            tmpCollection.update({}, {$set: {totalFee: customerFee, totalAmount: totalAmount}});
            $('.hide-show').slideUp(300);
            $('.promotion-hide-show').hide('fast');
            $(".show-hide-bank").hide('fast');
            style = "display: none;"
        } else {
            instance.$('[name="customerFee"]').prop('readonly', false);
            instance.$('[name="discountFee"]').prop('readonly', false);
            Meteor.call('promotionLabel', Session.get('transferDate'), function (error, result) {
                if (result) {
                    state.set('promotionLabel', 'Promotion');
                }
                state.set('promotionLabel', "None Promotion");
                $('.hide-show').slideDown(300);
            });
            $('.promotion-hide-show').show('fast');
            if (type == 'OUT') {
                $(".show-hide-bank").show('fast');
            } else {
                $(".show-hide-bank").hide('fast');
            }
        }

        //AutoForm.resetForm('MoneyTransfer_transferForm');
        instance.$('[name="productId"]').val('').trigger('change');
        tmpCollection.remove({});
        clearOnSuccess();
    },
    'click [name="type"]'(e, instance){
        Session.set('typeValidate', null);
        Session.set('refCode', null);
        Session.set('dateNote', null);
        Session.set('timeNote', null);
        Session.set('senderIdValidate', null);
        Session.set('senderValidatePhone', null);
        Session.set('receiverIdValidate', null);
        Session.set('receiverValidatePhone', null);
        Session.set('productIdValidate', null);
        Session.set('currencyIdValidate', null);
        Session.set('amountValidate', null);
        Session.set('bankNameValidate', null);
        Session.set('bankNumberValidate', null);
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
                $('.show-hide-bank').hide("fast");
                tmpCollection.update({}, {$set: {totalAmount: totalAmountThaiIn}});
            } else if (type == "OUT") {

                $(".show-hide-bank").show('fast');
                tmpCollection.update({}, {$set: {totalAmount: totalAmountThaiOut}});
            }
        }
    },
    'change [name="senderId"]'(e, instance){
        let senderId = $(e.currentTarget).val();
        Session.set('senderId', {senderId});
        //Session.set('senderIdValidate', null);
        // Session.set('senderValidatePhone', null);
    },
    'change [name="receiverId"]'(e, instance){
        let receiverId = $(e.currentTarget).val();
        let transferType = instance.$("input:radio[name=transferType]:checked").val();
        let type = instance.$("input:radio[name=type]:checked").val();
        Session.set('checkReceiverTransferType', transferType);
        Session.set('checkReceiverType', type);
        Session.set('receiverId', {receiverId});

        //Session.set('receiverIdValidate', null);
        //Session.set('receiverValidatePhone', null);
    },
    'change [name="productId"]'(e, instance){
        let productId = $(e.currentTarget).val();
        Session.set("productId", productId);
        //Session.set('productIdValidate', null);
        //$('[name="currencyId"]').val('');
        //clearOnchange();
        //tmpCollection.remove({});

        Meteor.call("getCurrency", productId, function (error, result) {
            if (result) {
                state.set('currencyList', result);
                //instance.$('[name="amount"]').prop("readonly", true);
            } else {
                //instance.$('[name="amount"]').prop("readonly", true);
            }
        });
    },
    'change [name="currencyId"]'(e, instance){
        //Session.set('currencyIdValidate', null);
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
        }
        else {
            instance.$('[name="amount"]').prop("readonly", true);
        }
    },
    'keyup [name="amount"]'(e, instance){
        debugger;
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
                    let khmerInAmount = new BigNumber(amount).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
                    let totalAmountPri = calculateTotalAmount(amount, result.customerFee);
                    let totalAmount = new BigNumber(totalAmountPri).minus(new BigNumber(totalExchangeAmount)).toFixed(2);
                    // let totalThaiIn=new BigNumber(result.customerFee).add(new BigNumber(totalExchangeAmount)).toFixed(2);
                    // let totalAmountThaiIn = new BigNumber(amount).minus(new BigNumber(totalThaiIn)).toFixed(2);
                    let totalAmountThaiIn = new BigNumber(amount).minus(new BigNumber(result.customerFee)).minus(new BigNumber(totalExchangeAmount)).toFixed(2);

                    if (transferType == 'khmer') {
                        if (type == "IN") {
                            tmpCollection.update({}, {$set: {totalAmount: khmerInAmount}});
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
                    //instance.$('[name="baseAmountFirst"]').val(0);
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
    'keyup [name="customerFee"]'(e, instance){
        let customerFee = $(e.currentTarget).val();
        let discountFee = instance.$('[name="discountFee"]').val();
        let amount = instance.$('[name="amount"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
        let totalFee = calculateAfterDiscount(customerFee, discountFee);
        let totalAfterDis = new BigNumber(customerFee).minus(new BigNumber(totalFee)).toFixed(2);
        let disAndPro = new BigNumber(promotionAmount).add(new BigNumber(totalAfterDis)).toFixed(2);
        let reFeeIn = new BigNumber(customerFee).minus(new BigNumber(disAndPro)).toFixed(2);

        let totalAmountIn = new BigNumber(amount).minus(new BigNumber(reFeeIn)).toFixed(2);
        let totalAmountOut = new BigNumber(amount).add(new BigNumber(reFeeIn)).toFixed(2);

        if (transferType == 'thai') {
            if (type == 'IN') {
                tmpCollection.update({}, {$set: {totalFee: reFeeIn, totalAmount: totalAmountIn}});
            } else {
                tmpCollection.update({}, {$set: {totalFee: reFeeIn, totalAmount: totalAmountOut}});
            }
        }
    },
    'keyup [name="discountFee"]'(e, instance)
    {
        let discountFee = $(e.currentTarget).val();
        let amount = instance.$('[name="amount"]').val();
        let customerFee = instance.$('[name="customerFee"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let transferType = instance.$('input:radio[name=transferType]:checked').val();
        let type = instance.$("input:radio[name=type]:checked").val();
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
        let bothBaseAmount = new BigNumber(baseAmountFirst).add(new BigNumber(baseAmountSecond)).toFixed(2);
        let totalFee = calculateAfterDiscount(customerFee, discountFee);
        let totalFeeOut = new BigNumber(totalFee).minus(promotionAmount).toFixed(2);
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
                let totalAmount = new BigNumber(thaiIn).add(new BigNumber(totalAfterDis)).add(new BigNumber(promotionAmount)).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFeeOut, totalAmount: totalAmount}});
            } else {
                let thaiOut = new BigNumber(amount).add(new BigNumber(customerFee)).toFixed(2);
                let ex = new BigNumber(totalAfterDis).add(new BigNumber(bothBaseAmount)).add(new BigNumber(promotionAmount)).toFixed(2);
                // let totalAmount = new BigNumber(thaiOut).minus(new BigNumber(ex)).minus(new BigNumber(bothBaseAmount)).toFixed(2);
                let totalAmount = new BigNumber(thaiOut).minus(new BigNumber(ex)).toFixed(2);
                tmpCollection.update({}, {$set: {totalFee: totalFeeOut, totalAmount: totalAmount}});
            }
        }

    }
    ,
    'click .js-print'(e, instance)
    {
        Session.set("savePrint", true);
    }
    ,

    'click .sender'(e, instance)
    {
        Session.set('quickAddCustomerFlag', 'sender');
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    }
    ,
    'click .receiver'(e, instance)
    {
        Session.set('quickAddCustomerFlag', 'receiver');
        alertify.customer(fa('plus', 'Customer'), renderTemplate(customerForm));
    }
    ,
    'keyup [name="baseAmountFirst"]'(e, instance)
    {
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
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
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
                        state.set('exToAmountBuyingFirst', res.buying);
                        state.set('toAmountFirst', res.selling);
                        state.set('resultIncomeAmountFirst', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).toFixed(2);
                    let resultAmountFirst = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountFirstOut)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('exToAmountBuyingFirst', res.buying);
                        state.set('toAmountFirst', res.selling);
                        state.set('resultIncomeAmountFirst', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                }
            } else {
                if (type == "IN") {
                    let totalSubtract = new BigNumber(customerFee).add(new BigNumber(bothBaseAmountFirstIn)).toFixed(2);
                    let resultAmountFirst = new BigNumber(amount).add(new BigNumber(totalFeeAfterDis)).minus(new BigNumber(totalSubtract)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('exToAmountBuyingFirst', res.buying);
                        state.set('toAmountFirst', res.selling);
                        state.set('resultIncomeAmountFirst', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountFirst}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(bothBaseAmountFirstIn)).toFixed(2);
                    //let resultAmountFirst = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountFirstOut)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToFirst, baseAmountFirst, function (err, res) {
                        state.set('exToAmountBuyingFirst', res.buying);
                        state.set('toAmountFirst', res.selling);
                        state.set('resultIncomeAmountFirst', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                    });
                }
            }

        }
    }
    ,
    'keyup [name="baseAmountSecond"]'(e, instance){
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
        let promotionAmount = instance.$('[name="promotionAmount"]').val();
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
                        state.set('exToAmountBuyingSecond', res.buying);
                        state.set('toAmountSecond', res.selling);
                        state.set('resultIncomeAmountSecond', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).toFixed(2);
                    let resultAmountSecond = new BigNumber(totalAmount).minus(new BigNumber(bothBaseAmountSecondOut)).toFixed(2);
                    tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('exToAmountBuyingSecond', res.buying);
                        state.set('toAmountSecond', res.selling);
                        state.set('resultIncomeAmountSecond', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: resultAmountSecond}});
                    });
                }
            } else {
                if (type == 'IN') {
                    let thaiIn = new BigNumber(customerFee).add(new BigNumber(bothBaseAmountSecondIn)).toFixed(2);
                    let totalThaiIn = new BigNumber(amount).add(new BigNumber(totalFeeAfterDis)).minus(new BigNumber(thaiIn)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('exToAmountBuyingSecond', res.buying);
                        state.set('toAmountSecond', res.selling);
                        state.set('resultIncomeAmountSecond', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: totalThaiIn}});
                        tmpCollection.update({}, {$set: {totalAmount: totalThaiIn}});
                    });
                } else {
                    let totalAmount = new BigNumber(amount).add(new BigNumber(totalFee)).minus(new BigNumber(bothBaseAmountSecondIn)).toFixed(2);
                    Meteor.call("calculateExchangeRateSelling", currencyId, convertToSecond, baseAmountSecond, function (err, res) {
                        state.set('exToAmountBuyingSecond', res.buying);
                        state.set('toAmountSecond', res.selling);
                        state.set('resultIncomeAmountSecond', new BigNumber(res.selling).minus(new BigNumber(res.buying)).toFixed(2));
                        tmpCollection.update({}, {$set: {totalAmount: totalAmount}});
                    });
                }
            }


        }
    }
    ,
    'keyup [name="sellingFirst"]'(e, instance)
    {
        let sellingFirst = $(e.currentTarget).val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToFirst = instance.$('[name="convertToFirst"]').val();
        let baseAmountFirst = instance.$('[name="baseAmountFirst"]').val();
        let toAmountBuyingFirst = instance.$('[name="toAmountBuyingFirst"]').val();
        if (currencyId && convertToFirst && baseAmountFirst && sellingFirst) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToFirst, baseAmountFirst, sellingFirst, function (error, res) {
                state.set("toAmountFirst", res);
                state.set('resultIncomeAmountFirst', new BigNumber(res).minus(new BigNumber(toAmountBuyingFirst)).toFixed(2));
            });
        }
    }
    ,
    'keyup [name="sellingSecond"]'(e, instance)
    {
        let sellingSecond = $(e.currentTarget).val();
        let currencyId = instance.$('[name="currencyId"]').val();
        let convertToSecond = instance.$('[name="convertToSecond"]').val();
        let baseAmountSecond = instance.$('[name="baseAmountSecond"]').val();
        let toAmountBuyingSecond = instance.$('[name="toAmountBuyingSecond"]').val();
        if (currencyId && convertToSecond && baseAmountSecond && sellingSecond) {
            Meteor.call("exchangeRateTransfer", currencyId, convertToSecond, baseAmountSecond, sellingSecond, function (error, res) {
                state.set('toAmountSecond', res);
                state.set('resultIncomeAmountSecond', new BigNumber(res).minus(new BigNumber(toAmountBuyingSecond)).toFixed(2));
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
            }
        } else {
            if (Session.get("savePrint")) {
                Meteor.call('invoice', result, function (err, doc) {
                    alertify.invoice(fa('', 'Invoice'), renderTemplate(invoice, doc));
                });
            }
            Session.set("savePrint", false);
            tmpCollection.remove({});
            state.set('toAmountFirst', 0);
            state.set('toAmountSecond', 0);
            state.set("exchangeTransfer", 0);
            state.set('exchangeId', null);
            state.set('senderPhone', null);
            state.set('receiverPhone', null);
            state.set('bankName', null);
            state.set('bankNumber', null);
            state.set('exToAmountBuyingSecond', 0);
            state.set('toAmountSecond', 0);
            state.set('resultIncomeAmountSecond', 0);
            state.set('exToAmountBuyingFirst', 0);
            state.set('toAmountFirst', 0);
            state.set('resultIncomeAmountFirst', 0);
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
    // $('[name="baseAmountFirst"]').val(0);
    // $('[name="baseAmountSecond"]').val(0);
}
function readOnlyFalse() {
    $('[name="sellingFirst"]').prop("readonly", false);
    $('[name="sellingSecond"]').prop("readonly", false);
    $('[name="baseAmountFirst"]').prop("readonly", false);
    $('[name="baseAmountSecond"]').prop("readonly", false);
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
    return new BigNumber(customerFee).times(new BigNumber(new BigNumber(1).minus(new BigNumber(discountFee).div(new BigNumber(100))))).toFixed(2);
}
function calculateTotalAmount(amount, disAmountFee) {
    return new BigNumber(amount).add(new BigNumber(disAmountFee)).toFixed(2);
}
