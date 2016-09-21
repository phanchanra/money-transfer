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
import {Provider} from '../../common/collections/provider';

// Tabular
import {ProviderTabular} from '../../common/tabulars/provider';
// Page
import './provider.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_provider,
    actionTmpl = Template.MoneyTransfer_providerAction,
    formTmpl = Template.MoneyTransfer_providerForm,
    showTmpl = Template.MoneyTransfer_providerShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('provider');
    createNewAlertify('providerShow');
});

indexTmpl.helpers({
    tabularTable(){
        return ProviderTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.provider(fa('plus', 'Provider'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.provider(fa('pencil', 'Provider'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        let id = this._id;
        // Meteor.call('productExist', this._id, function (error, result) {
        //     if (result) {
        //         swal("Sorry can not remove", "This product is already used!");
        //     } else {
        //         destroyAction(
        //             Product,
        //             {_id: id},
        //             {title: 'Product', productTitle: id}
        //         );
        //     }
        // });
        destroyAction(
            Provider,
            {_id: id},
            {title: 'Provider', providerTitle: id}
        );
    },
    'click .js-display' (event, instance) {
        alertify.providerShow(fa('eye', 'Provider'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.providerById', currentData._id);
        }
    });
});

formTmpl.helpers({
    collection(){
        return Provider;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Provider.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.providerById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Provider.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.provider().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_providerForm'], hooksObject);
