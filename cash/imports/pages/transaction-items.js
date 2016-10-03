import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {_} from 'meteor/erasaur:meteor-lodash';
import {$} from 'meteor/jquery';
import {TAPi18n} from 'meteor/tap:i18n';
import {ReactiveTable} from 'meteor/aslagle:reactive-table';

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {reactiveTableSettings} from '../../../core/client/libs/reactive-table-settings.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {ItemsSchema} from '../../common/collections/transaction-items.js';
import {Transaction} from '../../common/collections/transaction.js';

// Page
import './transaction-items.html';

// Declare template
var itemsTmpl = Template.Cash_transactionItems,
    actionItemsTmpl = Template.Cash_transactionItemsAction,
    editItemsTmpl = Template.Cash_transactionItemsEdit;

// Local collection
var itemsCollection;


itemsTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('item');

    // State
    this.chartCashState = new ReactiveVar();
    this.amountState = new ReactiveVar(0);

    // Data context
    let data = Template.currentData();
    itemsCollection = data.itemsCollection;
});

itemsTmpl.helpers({
    tableSettings: function () {
        let i18nPrefix = 'cash.transaction.schema';

        reactiveTableSettings.showFilter = false;
        reactiveTableSettings.showNavigation = 'never';
        reactiveTableSettings.showColumnToggles = false;
        reactiveTableSettings.collection = itemsCollection;
        reactiveTableSettings.fields = [
            {key: 'chartCashLabel', label: 'Chart'},
            {
                key: 'amount',
                label: 'Amount',
                fn (value, object, key) {
                    return numeral(value).format('0,0.00');
                }
            },
            {
                key: '_id',
                label(){
                    return fa('bars', '', true);
                },
                headerClass: function () {
                    let css = 'text-center col-action-transaction-item';
                    return css;
                },
                tmpl: actionItemsTmpl, sortable: false
            }
        ];

        return reactiveTableSettings;
    },
    amount(){
        const instance = Template.instance();
        return instance.amountState.get();
    },
    schema(){
        return ItemsSchema;
    },
    disabledAddItemBtn: function () {
        const instance = Template.instance();
        if (instance.chartCashState.get() && instance.amountState.get() > 0) {
            return {};
        }

        return {disabled: true};
    },
    totalAmount: function () {
        let totalAmount = 0;
        let getItems = itemsCollection.find();
        getItems.forEach((obj)=> {
            totalAmount += obj.amount;
        });

        return totalAmount;
    }
});

itemsTmpl.events({
    'change [name="chartCashId"]': function (event, instance) {
        instance.chartCashState.set(event.currentTarget.value);

        // Clear
        instance.amountState.set(0);
        instance.$('[name="amount"]').val(0);

        // Check exist value
        if(event.currentTarget.value){
            instance.$('[name="amount"]').focus();
        }
    },
    'keyup [name="amount"]': function (event, instance) {
        let amount = instance.$('[name="amount"]').val();
        amount = _.isEmpty(amount) ? 0 : parseFloat(amount);

        instance.amountState.set(amount);
    },
    'click .js-add-item': function (event, instance) {
        let chartCashId = instance.$('[name="chartCashId"]').val();
        let chartCashLabel = instance.$('[name="chartCashId"] option:selected').text();
        let amount = math.round(parseFloat(instance.$('[name="amount"]').val()), 2);

        // Check exist
        let exist = itemsCollection.findOne({_id: chartCashId});
        if (exist) {
            amount += exist.amount;

            itemsCollection.update(
                {_id: chartCashId},
                {$set: {amount: amount}}
            );
        } else {
            itemsCollection.insert({
                _id: chartCashId,
                chartCashId: chartCashId,
                chartCashLabel: chartCashLabel,
                amount: amount
            });
        }

        // Reset
        AutoForm.resetForm('Cash_transactionItems');
        instance.chartCashState.set(null);
        instance.amountState.set(0);
    },
    // Reactive table for item
    'click .js-update-item': function (event, instance) {
        alertify.item(fa('pencil', 'Chart Cash'), renderTemplate(editItemsTmpl, this));
    },
    'click .js-destroy-item': function (event, instance) {
        destroyAction(
            itemsCollection,
            {_id: this._id},
            {title: 'Chart Cash', itemTitle: this.chartCashId}
        );
    }
});


// Edit
editItemsTmpl.onCreated(function () {
    let self = this;
    self.amountState = new ReactiveVar(0);

    self.autorun(()=> {
        let data = Template.currentData();
        self.amountState.set(data.amount);
    });
});

editItemsTmpl.helpers({
    schema(){
        return ItemsSchema;
    },
    data: function () {
        let data = Template.currentData();
        return data;
    }
});

editItemsTmpl.events({});

let hooksObject = {
    onSubmit: function (insertDoc, updateDoc, currentDoc) {
        this.event.preventDefault();

        // Check old item
        if (insertDoc.chartCashId == currentDoc.chartCashId) {
            itemsCollection.update(
                {_id: currentDoc.chartCashId},
                updateDoc
            );
        } else {
            itemsCollection.remove({_id: currentDoc.chartCashId});

            // Check exist item
            let exist = itemsCollection.findOne({_id: insertDoc.chartCashId});
            if (exist) {
                let amount = exist.amount + insertDoc.amount;

                itemsCollection.update(
                    {_id: insertDoc.chartCashId},
                    {$set: {amount: amount}}
                );
            } else {
                let chartCashLabel = $('[name="chartCashId"] option:selected').text();

                itemsCollection.insert({
                    _id: insertDoc.chartCashId,
                    chartCashId: insertDoc.chartCashId,
                    chartCashLabel: chartCashLabel,
                    amount: insertDoc.amount
                });
            }
        }

        this.done();
    },
    onSuccess: function (formType, result) {
        alertify.item().close();
        displaySuccess();
    },
    onError: function (formType, error) {
        displayError(error.message);
    }
};
AutoForm.addHooks(['Cash_transactionItemsEdit'], hooksObject);
