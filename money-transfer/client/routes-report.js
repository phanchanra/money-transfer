import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {FlowRouterTitle} from 'meteor/ostrio:flow-router-title';
import 'meteor/arillo:flow-router-helpers';
import 'meteor/zimme:active-route';
import 'meteor/theara:flow-router-breadcrumb';

// Lib
import {__} from '../../core/common/libs/tapi18n-callback-helper.js';

// Layout
import {Layout} from '../../core/client/libs/render-layout.js';
import '../../core/imports/layouts/report/index.html';

// Group
let MoneyTransferRoutes = FlowRouter.group({
    prefix: '/money-transfer',
    title: "Money Transfer",
    titlePrefix: 'Money Transfer > ',
    subscriptions: function (params, queryParams) {
        // Branch by user
        if (Meteor.user()) {
            let rolesBranch = Meteor.user().rolesBranch;
            this.register('core.branch', Meteor.subscribe('core.branch', {_id: {$in: rolesBranch}}));
        }
    }
});

// Transfer Summary
import '../imports/reports/transfer-summary';
MoneyTransferRoutes.route('/transfer-summary-report', {
    name: 'moneyTransfer.transferSummaryReport',
    title: "Summary Transfer",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferSummaryReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Transfer Summary  Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Detail Transfer
import '../imports/reports/transfer-detail';
MoneyTransferRoutes.route('/transfer-detail-report', {
    name: 'moneyTransfer.transferDetailReport',
    title: "Detail Transfer",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferDetailReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Transfer Detail Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Transfer Transaction
import '../imports/reports/transfer-transaction';
MoneyTransferRoutes.route('/transfer-transaction-report', {
    name: 'moneyTransfer.transferTransactionReport',
    title: "Transfer Transaction",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferTransactionReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Transfer Transaction Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Deposit withdrawal
import '../imports/reports/deposit-withdrawal';
MoneyTransferRoutes.route('/deposit-withdrawal-report', {
    name: 'moneyTransfer.depositWithdrawalReport',
    title: "Deposit Withdrawal",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_depositWithdrawalReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Deposit Withdrawal Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Balance Outstanding
import '../imports/reports/balance-outstanding';
MoneyTransferRoutes.route('/balance-outstanding-report', {
    name: 'moneyTransfer.transferBalanceOutstandingReport',
    title: "Balance Outstanding",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferBalanceOutstandingReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Balance Outstanding Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Balance
import '../imports/reports/balance';
MoneyTransferRoutes.route('/balance-report', {
    name: 'moneyTransfer.transferBalanceReport',
    title: "Balance",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferBalanceReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Balance Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

/********************
 * Borrowing
 *******************/
// Borrowing Invoice
import '../imports/reports/borrowingInvoice';
MoneyTransferRoutes.route('/borrowing-invoice-report', {
    name: 'moneyTransfer.borrowingInvoiceReport',
    title: "Borrowing Invoice",
    action: function (params, queryParams) {
        Layout.report('MoneyTransfer_borrowingInvoiceReport');
    },
});

// Borrowing Payment Invoice
import '../imports/reports/borrowingPaymentInvoice';
MoneyTransferRoutes.route('/borrowing-payment-invoice-report', {
    name: 'moneyTransfer.borrowingPaymentInvoiceReport',
    title: "Borrowing Payment Invoice",
    action: function (params, queryParams) {
        Layout.report('MoneyTransfer_borrowingPaymentInvoiceReport');
    },
});

// Borrowing
import '../imports/reports/borrowing';
MoneyTransferRoutes.route('/borrowing-report', {
    name: 'moneyTransfer.borrowingReport',
    title: "Borrowing Report",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowingReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Borrowing Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Borrowing Status
import '../imports/reports/borrowingStatus';
MoneyTransferRoutes.route('/borrowing-status-report', {
    name: 'moneyTransfer.borrowingStatusReport',
    title: "Borrowing Status Report",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowingStatusReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Borrowing Status Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Borrowing Balance
import '../imports/reports/borrowingBalance';
MoneyTransferRoutes.route('/borrowing-balance-report', {
    name: 'moneyTransfer.borrowingBalanceReport',
    title: "Borrowing Balance Report",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowingBalanceReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Borrowing Balance Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Borrowing Payment
import '../imports/reports/borrowingPayment';
MoneyTransferRoutes.route('/borrowing-payment-report', {
    name: 'moneyTransfer.borrowingPaymentReport',
    title: "Borrowing Payment Report",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowingPaymentReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Borrowing Payment Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
