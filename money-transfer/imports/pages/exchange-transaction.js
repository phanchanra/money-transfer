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
// Method
import {lookupExchangeTransaction} from '../../common/methods/lookup-exchange-transaction';

// Collection
import {ExchangeTransaction} from '../../common/collections/exchange-transaction';

// Tabular
import {ExchangeTransactionTabular} from '../../common/tabulars/exchange-transaction';
// Page
import './exchange-transaction.html';
import './transaction-items.js';
// Declare template
let itemsCollection = new Mongo.Collection(null);

let indexTmpl = Template.MoneyTransfer_exchangeTransaction,
    actionTmpl = Template.MoneyTransfer_exchangeTransactionAction,
    formTmpl = Template.MoneyTransfer_exchangeTransactionForm,
    showTmpl = Template.MoneyTransfer_exchangeTransactionShow;

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('exchangeTransaction', {size: 'lg'});
    createNewAlertify('exchangeTransactionShow');

});

indexTmpl.helpers({
    tabularTable(){
        return ExchangeTransactionTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch')};
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.exchangeTransaction(fa('plus', 'Exchange Transaction'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.exchangeTransaction(fa('pencil', 'Exchange Transaction'), renderTemplate(formTmpl, {exchangeTransactionId: this._id}));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            ExchangeTransaction,
            {_id: this._id},
            {title: 'Exchange Transaction', exchangeTransactionTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.exchangeTransactionShow(fa('eye', 'Exchange Transaction'), renderTemplate(showTmpl, this));
    },
});

formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.exchangeTransactionById', currentData._id);
        }
    });
    let self = this;
    self.isLoading = new ReactiveVar(false);
    self.transactionDoc = new ReactiveVar();
    //
    self.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            self.isLoading.set(true);

            lookupExchangeTransaction.callPromise({
                exchangeTransactionId: currentData.exchangeTransactionId
            }).then((result)=> {
                // Add items to local collection
                _.forEach(result.items, (value)=> {
                    itemsCollection.insert(value);
                });

                self.transactionDoc.set(result);
                self.isLoading.set(false);
            }).catch((err)=> {
                console.log(err);
            });
        }
    });
});
// Insert
formTmpl.helpers({
    collection(){
        return ExchangeTransaction;
    },
    isLoading(){
        return Template.instance().isLoading.get();
    },
    data () {
        let data = {
            formType: 'insert',
            doc: {}
        };

        let currentData = Template.currentData();
        if (currentData) {
            data.formType = 'update';
            data.doc = Template.instance().transactionDoc.get();
        }

        return data;
    },
    itemsCollection(){
        return itemsCollection;
    },
    disabledSubmitBtn: function () {
        let count = itemsCollection.find().count();
        if (count == 0) {
            return {disabled: true};
        }

        return {};
    }
});

formTmpl.onDestroyed(function () {
    // Remove items collection
    itemsCollection.remove({});
});
// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.exchangeTransactionById', this.data._id);
    });
});

showTmpl.helpers({
    data () {
        let data = ExchangeTransaction.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            doc.items = itemsCollection.find().fetch();
            return doc;
        },
        update: function (doc) {
            doc.$set.items = itemsCollection.find().fetch();

            delete doc.$unset;

            return doc;
        }
    },
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.exchangeTransaction().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);

    }
};
AutoForm.addHooks(['MoneyTransfer_exchangeTransactionForm'], hooksObject);


