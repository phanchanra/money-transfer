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
import '../../core/imports/ui/layouts/report/index.html';

// Group
let MoneyTransferRoutes = FlowRouter.group({
    prefix: '/money-transfer',
    title: "Money Transfer",
    titlePrefix: 'Money Transfer > ',
    subscriptions: function (params, queryParams) {
//     this.register('files', Meteor.subscribe('files'));
    }
});

// Transfer Summary
import '../imports/ui/pages/reports/transfer-summary';
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
import '../imports/ui/pages/reports/transfer-detail';
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
import '../imports/ui/pages/reports/transfer-transaction';
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
