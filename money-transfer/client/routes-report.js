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
// Transfer In
import '../imports/ui/pages/reports/transfer-in';
MoneyTransferRoutes.route('/transfer-in-report', {
    name: 'moneyTransfer.transferInReport',
    title: "Transfer In",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferInReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Transfer In Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Transfer Out
import '../imports/ui/pages/reports/transfer-out';
MoneyTransferRoutes.route('/transfer-out-report', {
    name: 'moneyTransfer.transferOutReport',
    title: "Transfer Out",
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transferOutReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: "Transfer Out Report",
        //icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
