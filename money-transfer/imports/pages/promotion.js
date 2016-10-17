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
import {Promotion} from '../../common/collections/promotion';

// Tabular
import {PromotionTabular} from '../../common/tabulars/promotion';
//function
// import {calculateIncome} from '../../common/globalState/calculateIncome'
// Page
import './promotion.html';

// Declare template
let indexTmpl = Template.MoneyTransfer_promotion,
    actionTmpl = Template.MoneyTransfer_promotionAction,
    formTmpl = Template.MoneyTransfer_promotionForm,
    showTmpl = Template.MoneyTransfer_promotionShow;


// Index
indexTmpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify('promotion');
    createNewAlertify('promotionShow');
});

indexTmpl.helpers({
    tabularTable(){
        return PromotionTabular;
    }
});

indexTmpl.events({
    'click .js-create' (event, instance) {
        alertify.promotion(fa('plus', 'Promotion'), renderTemplate(formTmpl));
    },
    'click .js-update' (event, instance) {
        alertify.promotion(fa('pencil', 'Promotion'), renderTemplate(formTmpl, this));
    },
    'click .js-destroy' (event, instance) {
        destroyAction(
            Promotion, {_id: this._id}, {title: 'Promotion', promotionTitle: this._id}
        );
        // let id = this._id;
        // Meteor.call('customerExist', this._id, function (error, result) {
        //     if (result) {
        //         displayError("This record has already used !");
        //         //swal("Sorry can not remove", "This customer is already used!");
        //     } else {
        //         destroyAction(
        //             Customer, {_id: id}, {title: 'Customer', customerTitle: id}
        //         );
        //     }
        // });
    },
    'click .js-display' (event, instance) {
        alertify.promotionShow(fa('eye', 'Product'), renderTemplate(showTmpl, this));
    }
});

// Form
formTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        if (currentData) {
            this.subscribe('moneyTransfer.promotionById', currentData._id);
        }
    });
});

formTmpl.helpers({
    collection(){
        return Promotion;
    },
    form(){
        let data = {doc: {}, type: 'insert'};
        let currentData = Template.currentData();

        if (currentData) {
            data.doc = Promotion.findOne({_id: currentData._id});
            data.type = 'update';
        }

        return data;
    }
});

// Show
showTmpl.onCreated(function () {
    this.autorun(()=> {
        let currentData = Template.currentData();
        this.subscribe('moneyTransfer.promotionById', currentData._id);
    });
});

showTmpl.helpers({
    data () {
        let currentData = Template.currentData();
        return Promotion.findOne(currentData._id);
    }
});

// Hook
let hooksObject = {
    onSuccess (formType, result) {
        if (formType == 'update') {
            alertify.promotion().close();
        }
        displaySuccess();
    },
    onError (formType, error) {
        displayError();
    }
};

AutoForm.addHooks(['MoneyTransfer_promotionForm'], hooksObject);
