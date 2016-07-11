import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {TAPi18n} from 'meteor/tap:i18n';

// Lib
import {createNewAlertify} from '../../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError} from '../../../../core/client/libs/display-alert.js';
import {__} from '../../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../../core/client/components/loading.js';
import '../../../../core/client/components/column-action.js';
import '../../../../core/client/components/form-footer.js';

// Collection
import {CashIn} from '../../api/collections/cash-in.js';

// Tabular
import {CashInTabular} from '../../../common/tabulars/cash-in.js';

// Page
import './cash-in.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_cashIn,
    actionTmpl = Template.MoneyTransfer_cashInAction,
    newTmpl = Template.MoneyTransfer_cashInNew,
    editTmpl = Template.MoneyTransfer_cashInEdit,
    showTmpl = Template.MoneyTransfer_cashInShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('cashIn');
});

indexTmpl.helpers({
    tabularTable(){
        return CashInTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.cashIn(fa('plus', TAPi18n.__('moneyTransfer.cashIn.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.cashIn(fa('pencil', TAPi18n.__('moneyTransfer.cashIn.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            CashIn,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.cashIn.title'), cashInTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.cashIn(fa('eye', TAPi18n.__('moneyTransfer.cashIn.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return CashIn;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.cashInById', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return CashIn;
    },
    data () {
        let data = CashIn.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.cashInById', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let key = `moneyTransfer.cashIn.schema.${label}.label`;
        return TAPi18n.__(key);
    },
    data () {
        let data = CashIn.findOne(this._id);
        data.photoUrl = null;
        if (data.photo) {
            let img = Files.findOne(data.photo);
            if (img) {
                data.photoUrl = img.url();
            }
        }

        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.cashIn().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks([
    'MoneyTransfer_cashInNew',
    'MoneyTransfer_cashInEdit'
], hooksObject);
