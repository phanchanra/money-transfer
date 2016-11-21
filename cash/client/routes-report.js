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
let CashRoutes = FlowRouter.group({
    prefix: '/cash',
    title: "Cash",
    titlePrefix: 'Cash > ',
    subscriptions: function (params, queryParams) {
        // Branch by user
        if (Meteor.user()) {
            let rolesBranch = Meteor.user().rolesBranch;
            this.register('core.branch', Meteor.subscribe('core.branch', {_id: {$in: rolesBranch}}));
        }
    }
});

// Transaction
import '../imports/reports/transaction.js';
CashRoutes.route('/transaction-report', {
    name: 'cash.transactionReport',
    title: 'Transaction Report',
    action: function (params, queryParams) {
        Layout.main('Cash_transactionReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Transaction Report',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});

// Cash In
import '../imports/reports/inOut.js';
CashRoutes.route('/inReport', {
    name: 'cash.inReport',
    title: 'Cash In Report',
    action: function (params, queryParams) {
        Layout.main('Cash_inOutReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Cash In Report',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});

// Cash Out
import '../imports/reports/inOut.js';
CashRoutes.route('/outReport', {
    name: 'cash.outReport',
    title: 'Cash Out Report',
    action: function (params, queryParams) {
        Layout.main('Cash_inOutReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Cash Out Report',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});

// Cash Balance (In & Out)
import '../imports/reports/balance.js';
CashRoutes.route('/balanceReport', {
    name: 'cash.balanceReport',
    title: 'Cash Balance (In - Out) Report',
    action: function (params, queryParams) {
        Layout.main('Cash_balanceReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Cash Balance (In - Out) Report',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});

// Cash Flow
import '../imports/reports/flow.js';
CashRoutes.route('/flowReport', {
    name: 'cash.flowReport',
    title: 'Cash Flow Report',
    action: function (params, queryParams) {
        Layout.main('Cash_flowReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Cash Flow Report',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});

// Chart Cash List
import '../imports/reports/chartList.js';
CashRoutes.route('/chartListReport', {
    name: 'cash.chartListReport',
    title: 'Chart Cash List',
    action: function (params, queryParams) {
        Layout.main('Cash_chartListReport');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Chart Cash List',
        // icon: 'file-o',
        parent: 'cash.home'
    }
});
