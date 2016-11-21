import {Meteor} from 'meteor/meteor';
import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {AutoForm} from 'meteor/aldeed:autoform';
import {sAlert} from 'meteor/juliancwirko:s-alert';
import 'meteor/theara:autoprint';
import 'printthis';

// Component
import '../../../core/imports/layouts/report/content.html';
import '../../../core/imports/layouts/report/sign-footer.html';
import '../../../core/client/components/loading.js';
import '../../../core/client/components/form-footer.js';

// Method
import {borrowingPaymentInvoiceReport} from '../../common/methods/reports/borrowingPaymentInvoice';

// Page
import '../stylesheets/theme.css';
import './borrowingPaymentInvoice.html';

// Declare template
let rptTmpl = Template.MoneyTransfer_borrowingPaymentInvoiceReport;


// Generate
rptTmpl.onCreated(function () {
    this.rptData = new ReactiveVar();

    this.autorun(()=> {
        let queryParams = FlowRouter.current().queryParams;
        queryParams.branchId = Session.get('currentBranch');

        console.log(queryParams);

        borrowingPaymentInvoiceReport.callPromise(queryParams)
            .then((result)=> {
                this.rptData.set(result);
            }).catch((err)=> {
                console.log(err.message);
            }
        );
    });
});
rptTmpl.helpers({
    rptData(){
        return Template.instance().rptData.get();
    },
    totalInterestDue(oldInterest, currentInterest){
        return oldInterest + currentInterest;
    },
    memoSafeString(memo){
        return Spacebars.SafeString(memo);
    }
});
