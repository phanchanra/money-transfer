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
import {Exchange} from '../../api/collections/exchange.js';

// Tabular
import {ExchangeTabular} from '../../../common/tabulars/exchange.js';

// Page
import './exchange.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_exchange,
    actionTmpl = Template.MoneyTransfer_exchangeAction,
    newTmpl = Template.MoneyTransfer_exchangeNew,
    editTmpl = Template.MoneyTransfer_exchangeEdit,
    showTmpl = Template.MoneyTransfer_exchangeShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('exchange', {size: 'lg'});
});

indexTmpl.helpers({
    tabularTable(){
        return ExchangeTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.exchange(fa('plus', TAPi18n.__('moneyTransfer.exchange.title')), renderTemplate(newTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.exchange(fa('pencil', TAPi18n.__('moneyTransfer.exchange.title')), renderTemplate(editTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Exchange,
            {_id: this._id},
            {title: TAPi18n.__('moneyTransfer.exchange.title'), exchangeTitle: this._id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.exchange(fa('eye', TAPi18n.__('moneyTransfer.exchange.title')), renderTemplate(showTmpl, this));
    }
});

// New
newTmpl.helpers({
    collection(){
        return Exchange;
    }
});

// Edit
editTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.exchange', this.data._id);
    });
});

editTmpl.helpers({
    collection(){
        return Exchange;
    },
    data () {
        let data = Exchange.findOne(this._id);
        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        this.subscribe('moneyTransfer.exchange', this.data._id);
    });
});

showTmpl.helpers({
    i18nLabel(label){
        let key = `moneyTransfer.exchange.schema.${label}.label`;
        return TAPi18n.__(key);
    },
    data () {
        let data = Exchange.findOne(this._id);
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
            alertify.exchange().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};


AutoForm.addHooks([
    'MoneyTransfer_exchangeNew',
    'MoneyTransfer_exchangeEdit'
], hooksObject);
