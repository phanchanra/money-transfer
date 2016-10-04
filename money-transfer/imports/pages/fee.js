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

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';
// Collection
import {Fee} from '../../common/collections/fee';
import {Product} from '../../common/collections/product';
import {Transfer} from '../../common/collections/transfer';
// Tabular
import {FeeTabular} from '../../common/tabulars/fee';
//function
import {tmpCollection} from '../../common/collections/tmpCollection';
// Page
import './fee.html';
// Declare template
let indexTmpl = Template.MoneyTransfer_fee,
    actionTmpl = Template.MoneyTransfer_feeAction,
    productTmpl = Template.MoneyTransfer_feeProduct,
    productShowTmpl = Template.MoneyTransfer_showProduct,
    formTmpl = Template.MoneyTransfer_feeForm,
    showTmpl = Template.MoneyTransfer_feeShow,
    serviceTmpl = Template.customObjectFieldForService;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('fee', {size: 'lg'});
    createNewAlertify('feeShow');

});

indexTmpl.helpers({
    tabularTable(){
        return FeeTabular;
    }

});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.fee(fa('plus', 'Fee'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        let feeId = this._id;
        Session.set("existFeeId", feeId);
        alertify.fee(fa('pencil', 'Fee'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        let id = this._id;
        Meteor.call('productFeeExist', this.productId, this.currencyId, function (error, result) {
            if (result) {
                swal("Sorry can not remove", "This product fee is already used!");
            } else {
                destroyAction(
                    Fee,
                    {_id: id},
                    {title: 'Fee', feeTitle: id}
                );
            }
        });
    },
    'click .js-display' (event, instance) {
        alertify.feeShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    },
    // 'click .add-balance': function (e, t) {
    //     //var productId = FlowRouter.getParam('productId');
    //     let productId = this.productId;
    //     let currencyId = this.currencyId;
    //     FlowRouter.go('moneyTransfer.bankAccount', {productId: productId, currencyId: currencyId,});
    // }
});
indexTmpl.onDestroyed(function () {
    tmpCollection.remove({});
});

// Product
productTmpl.events({
    'click .js-display-product' (event, instance) {
        Meteor.call("getProduct", this.productId, function (error, result) {
            alertify.feeShow(fa('eye', 'Product'), renderTemplate(productShowTmpl, result));
        });
    }
});

// Form
formTmpl.onRendered(function () {
});
formTmpl.onCreated(function () {
    Session.set("currencyId", 'USD');
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.feeById', currentData._id);
        }
    });
});
serviceTmpl.onCreated(function () {
    this.state = new ReactiveVar();
});
//helper
formTmpl.helpers({
    collection(){
        return Fee;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Fee.findOne({_id: currentData._id});
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
    }

});
serviceTmpl.helpers({
    ownerFee(){
        const ownerFee = Template.instance();
        return ownerFee.state.get();
    }
    // agentFee(){
    //     const agentFee = Template.instance();
    //     return agentFee.state.get();
    // }
});
formTmpl.onCreated(function () {
    Session.set("currencySymbol", "$");
    Session.set("currencyId", "USD");
});
formTmpl.events({
    'change [name="productId"]'(e, instance){
        let productId = $(e.currentTarget).val();
        let currencyId = Session.get("currencyId");
        //let currencyId = $('[name="currencyId"]').val();
        console.log(currencyId);
        let feeId = Session.get('existFeeId');
        Meteor.call("productAvailableInsert", productId, currencyId, function (error, result) {
            if (result) {
                if (feeId != result) {
                    instance.$('[name="save"]').prop('disabled', true);
                    swal("Please check", "Product and currency are already exist!");
                } else {
                    instance.$('[name="save"]').prop('disabled', false);
                }
            } else {
                instance.$('[name="save"]').prop('disabled', false);
            }

        });

    },
    'click [name="currencyId"]'(e, instance){
        let currencySymbol = $(e.currentTarget).val();
        let symbol;
        if (currencySymbol == 'USD') {
            symbol = '$'
        } else if (currencySymbol == 'KHR') {
            symbol = '៛'
        } else {
            symbol = 'B'
        }
        // UIBlock.block('Wait...');
        //$.blockUI();
        //Meteor.setTimeout(()=> {
        // UIBlock.unblock();
        Session.set("currencySymbol", symbol);
        //clear
        // $.unblockUI();
        //}, 200);

        Session.set("currencyId", currencySymbol);
        let productId = $('[name="productId"]').val();
        let feeId = Session.get('existFeeId');
        Meteor.call("productAvailableInsert", productId, currencySymbol, function (error, result) {
            if (result) {
                if (feeId != result) {
                    instance.$('[name="save"]').prop('disabled', true);
                    swal("Please check", "Product and currency are already exist!");
                } else {
                    instance.$('[name="save"]').prop('disabled', false);
                }
            } else {
                instance.$('[name="save"]').prop('disabled', false);
            }

        });

    }
});

serviceTmpl.events({
    'keyup .customer-fee'(e, instance){
        let customerFee = $(e.currentTarget).val();
        let agentFee = instance.$('.agent-fee').val();
        instance.state.set(new BigNumber(customerFee).minus(new BigNumber(agentFee)));
    },
    'keyup .agent-fee'(e, instance){
        let agentFee = $(e.currentTarget).val();
        let customerFee = instance.$('.customer-fee').val();
        //if (customerFee < agentFee) {
        if (Number(agentFee) > Number(customerFee)) {
            swal("Please check agent fee", "Agent Fee must be less than customer fee!");
            instance.$(".agent-fee").val(0);
            instance.$(".owner-fee").val(0);
        } else {
            instance.state.set(new BigNumber(customerFee).minus(new BigNumber(agentFee)));
        }
    },
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.feeById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Fee.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    // before: {
    //     insert(doc){
    //         doc.lastOpeningAmount = $('[name="openingAmount"]').val();
    //         doc.lastOpeningAmountFee = $('[name="openingAmount"]').val();
    //         return doc;
    //     },
    //     update(doc){
    //         doc.$set.lastOpeningAmount = $('[name="openingAmount"]').val();
    //         doc.$set.lastOpeningAmountFee = $('[name="openingAmount"]').val();
    //
    //         return doc;
    //     }
    // },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.fee().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);

    }
};

AutoForm.addHooks(['MoneyTransfer_feeForm'], hooksObject);
