import {Template} from 'meteor/templating';
import {AutoForm} from 'meteor/aldeed:autoform';
import {Roles} from  'meteor/alanning:roles';
import {alertify} from 'meteor/ovcharik:alertifyjs';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import {fa} from 'meteor/theara:fa-helpers';
import {lightbox} from 'meteor/theara:lightbox-helpers';
import {TAPi18n} from 'meteor/tap:i18n';

// Lib
import {createNewAlertify} from '../../../core/client/libs/create-new-alertify.js';
import {renderTemplate} from '../../../core/client/libs/render-template.js';
import {destroyAction} from '../../../core/client/libs/destroy-action.js';
import {displaySuccess, displayError, displayWarning} from '../../../core/client/libs/display-alert.js';
import {__} from '../../../core/common/libs/tapi18n-callback-helper.js';

// Component
import '../../../core/client/components/loading.js';
import '../../../core/client/components/column-action.js';
import '../../../core/client/components/form-footer.js';

// Collection
import {ChartCash} from '../../common/collections/chartCash.js';

// Tabular
import {ChartCashTabular} from '../../common/tabulars/chartCash.js';

// Page
import './chartCash.html';

// Declare template
let indexTmpl = Template.Cash_chartCash,
    actionTmpl = Template.Cash_chartCashAction,
    formTmpl = Template.Cash_chartCashForm,
    showTmpl = Template.Cash_chartCashShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('chartCash');
});

indexTmpl.helpers({
    tabularTable(){
        return ChartCashTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.chartCash(fa('plus', 'Chart Cash'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        // Check opening & closing
        if (this._id == '0001' || this._id == '0002') {
            displayWarning('This doc can not update!');
        } else {
            alertify.chartCash(fa('pencil', 'Chart Cash'), renderTemplate(formTmpl, {chartCashId: this._id}));
        }
    },
    'click .js-destroy' (event, instance) {
        if (this._id == '0001' || this._id == '0002') {
            displayWarning('This doc can not delete!');
        } else {
            destroyAction(
                ChartCash,
                {_id: this._id},
                {title: 'Chart Cash', chartCashTitle: this._id}
            );
        }
    },
    'click .js-display' (event, instance) {
        alertify.chartCash(fa('eye', 'Chart Cash'), renderTemplate(showTmpl, {chartCashId: this._id}));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('cash.chartCashById', currentData.chartCashId);
        }
    });
});

formTmpl.helpers({
    collection(){
        return ChartCash;
    },
    data () {
        let data = {
            formType: 'insert',
            doc: {}
        };
        let currentData = Template.currentData();

        if (currentData) {
            data.formType = 'update';
            data.doc = ChartCash.findOne(currentData.chartCashId);
        }

        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('cash.chartCashById', currentData.chartCashId);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        let data = ChartCash.findOne(currentData._id);
        return data;
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.chartCash().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError(error.message);
    }
};

AutoForm.addHooks(['Cash_chartCashForm'], hooksObject);
