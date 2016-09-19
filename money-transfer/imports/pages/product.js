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
import {Product} from '../../common/collections/product';

// Tabular
import {ProductTabular} from '../../common/tabulars/product';
//function
// import {calculateIncome} from '../../common/globalState/calculateIncome'
// Page
import './product.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_product,
    actionTmpl = Template.MoneyTransfer_productAction,
    formTmpl = Template.MoneyTransfer_productForm,
    showTmpl = Template.MoneyTransfer_productShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('product', {size: 'lg'});
    createNewAlertify('productShow');
});

indexTmpl.helpers({
    tabularTable(){
        return ProductTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.product(fa('plus', 'Product'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.product(fa('pencil', 'Product'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        let id = this._id;
        Meteor.call('productExist', this._id, function (error, result) {
            if (result) {
                swal("Sorry can not remove", "This product is already used!");
            } else {
                destroyAction(
                    Product,
                    {_id: id},
                    {title: 'Product', productTitle: id}
                );
            }
        });
    },
    'click .js-display' (event, instance) {
        alertify.productShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.productById', currentData._id);
        }
    });
});

formTmpl.helpers({
    collection(){
        return Product;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Product.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.productById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Product.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.product().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_productForm'], hooksObject);
