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

// Customer list
import '../imports/ui/pages/reports/customer';
MoneyTransferRoutes.route('/customer-report', {
    name: 'moneyTransfer.customerReport',
    title: 'Customer Report',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_customerReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Customer Report',
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Summary Transfer
import '../imports/ui/pages/reports/summary-transfer';
MoneyTransferRoutes.route('/summary-transfer-report', {
    name: 'moneyTransfer.summaryTransferReport',
    title: "Summary Transfer",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_summaryTransferReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Summary Transfer Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Detail Transfer
import '../imports/ui/pages/reports/detail-transfer';
MoneyTransferRoutes.route('/detail-transfer-report', {
    name: 'moneyTransfer.detailTransferReport',
    title: "Detail Transfer",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_detailTransferReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Detail Transfer Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
