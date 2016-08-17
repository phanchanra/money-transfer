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
import {Supplier} from '../../api/collections/supplier';

// Tabular
import {SupplierTabular} from '../../../common/tabulars/supplier';
//function
import {calculateIncome} from '../../../common/globalState/calculateIncome'
// Page
import './supplier.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_supplier,
    actionTmpl = Template.MoneyTransfer_supplierAction,
    newTmpl = Template.MoneyTransfer_supplierNew,
    editTmpl = Template.MoneyTransfer_supplierEdit,
    showTmpl = Template.MoneyTransfer_supplierShow,
    newServiceTmp=Template.customObjectFieldForService;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('supplier',);
    createNewAlertify('supplierShow', {size: 'lg'});

    // Reactive table filter
    // this.filter = new ReactiveTable.Filter('moneyTransfer.customerByBranchFilter', ['branchId']);
    // this.autorun(()=> {
    //     this.filter.set(Session.get('currentBranch'));
    // });
});

indexTmpl.helpers({
    tabularTable(){
        return SupplierTabular;
    }

});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.supplier(fa('plus', TAPi18n.__('moneyTransfer.supplier.title')), renderTemplate(newTmpl)).maximize();
    },
    'click .js-update' (event, instance) {
        alertify.supplier(fa('pencil', TAPi18n.__('moneyTransfer.supplier.title')), renderTemplate(editTmpl, this)).maximize();
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Supplier,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.supplier.title'), supplierTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.supplierShow(fa('eye', TAPi18n.__('moneyTransfer.supplier.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Supplier;
    }

});
newTmpl.events({
    'change [name=""]'(e, instance){
        let status = $('[name="status"]:checked').val();
        Session.set("status", status);
    }
});
newServiceTmp.onCreated(function () {
    this.state = new ReactiveVar(0);
});
newServiceTmp.helpers({
    income(){
        const income=Template.instance();
        return income.state.get();
    }
});
newServiceTmp.events( {
    'keyup .fee'(e, instance){
        let fee=$(e.currentTarget).val();
        let expend=instance.$(e.currentTarget).val();
        instance.state.set(calculateIncome(fee, expend));
    },
    'keyup .expend'(e, instance){
        let expend=$(e.currentTarget).val();
        let fee=instance.$('.fee').val();
        instance.state.set(calculateIncome(fee, expend));
    }
});
// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.supplier', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return Supplier;
    },
    data () {
        let data = Supplier.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.supplier', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let i18nLabel = `moneyTransfer.supplier.schema.${label}.label`;
        return i18nLabel;
    },
    data () {
        let data = Supplier.findOne(this._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.supplier().close();
        }else{
            let status=Session.get("status");
            if (status == 'Internal') {
                $('[name="status"][value="Internal"]').prop('checked', true);
            } else {
                $('[name="transferType"][value="External"]').prop('checked', true);
            }
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_supplierNew',
    'MoneyTransfer_supplierEdit'
], hooksObject);
