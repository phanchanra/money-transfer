import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {_} from 'meteor/erasaur:meteor-lodash';
import 'meteor/theara:jsonview';
import {TAPi18n} from 'meteor/tap:i18n';
import 'meteor/tap:i18n-ui';


// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Method
import {lookupTransaction} from '../../common/methods/lookup-transaction';

// Collection
import {Transaction} from '../../common/collections/transaction.js';

// Tabular
import {TransactionTabular} from '../../common/tabulars/transaction.js';

// Page
import './transaction.html';
import './transaction-items.js';

// Declare template
let indexTmpl = Template.Cash_transaction,
    actionTmpl = Template.Cash_transactionAction,
    formTmpl = Template.Cash_transactionForm,
    showTmpl = Template.Cash_transactionShow;

// Local collection
let itemsCollection = new Mongo.Collection(null);

// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('transaction');
    createNewAlertify('transactionShow',);
});

indexTmpl.helpers({
    tabularTable(){
        return TransactionTabular;
    },
    selector() {
        return {branchId: Session.get('currentBranch')};
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.transaction(fa('plus', 'Transaction'), renderTemplate(formTmpl)).maximize();
    },
    'click .js-update' (event, instance) {
        // Set cash type session
        Session.set('cashType', this.cashType);

        alertify.transaction(fa('pencil', 'Transaction'), renderTemplate(formTmpl, {transactionId: this._id})).maximize();
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Transaction,
            {_id: this._id},
            {title: 'Transaction', itemTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.transactionShow(fa('eye', 'Transaction'), renderTemplate(showTmpl, {transactionId: this._id}));
    }
});

// New
formTmpl.onCreated(function () {
    this.isLoading = new ReactiveVar(false);
    this.transactionDoc = new ReactiveVar();

    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.isLoading.set(true);

            lookupTransaction.callPromise({
                transactionId: currentData.transactionId
            }).then((result)=> {
                this.transactionDoc.set(result);

                // Add items to local collection
                _.forEach(result.items, (value)=> {
                    itemsCollection.insert(value);
                });

                this.isLoading.set(false);
            }).catch((err)=> {
                console.log(err.message);
            });
        }
    });
});

formTmpl.helpers({
    collection(){
        return Transaction;
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

formTmpl.events({
    'change [name="cashType"]'(event, instance){
        Session.set('cashType', event.currentTarget.value);

        // Clear
        clearItems();
    }
});

formTmpl.onDestroyed(function () {
    Session.set('cashType', null);

    // Remove itemsCollection
    itemsCollection.remove({});
});

// Show
showTmpl.onCreated(function () {
    this.transactionDoc = new ReactiveVar();

    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            lookupTransaction.callPromise({
                transactionId: currentData.transactionId
            }).then((result)=> {
                this.transactionDoc.set(result);
            }).catch((err)=> {
                console.log(err.message);
            });
        }
    });
});

showTmpl.helpers({
    data () {
        let data = Template.instance().transactionDoc.get();

        // Use jsonview
        if (data) {
            data.des = Spacebars.SafeString(data.des);
            data.jsonViewOpts = {collapsed: true};
        }

        return data;
    }
});

// Hook
let hooksObject = {
    before: {
        insert: function (doc) {
            doc.items = itemsCollection.find({}, {}).fetch();
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
            alertify.transaction().close();
        }
        // Clear
        clearItems();

        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'Cash_transactionForm'
], hooksObject);


function clearItems() {
    // Reset item form (child)
    AutoForm.resetForm('Cash_transactionItems');

    // Remove itemsCollection
    itemsCollection.remove({});
}