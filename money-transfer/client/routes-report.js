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

// // Customer list
// import '../imports/ui/reports/customer.js';
// MoneyTransferRoutes.route('/customer-report', {
//     name: 'moneyTransfer.customerReport',
//     title: __('moneyTransfer.customerReport.title'),
//     action: function (params, queryParams) {
//         Layout.main('MoneyTransfer_customerReport');
//     },
//     breadcrumb: {
//         //params: ['id'],
//         //queryParams: ['show', 'color'],
//         title: __('moneyTransfer.customerReport.title'),
//         icon: 'users',
//         parent: 'moneyTransfer.home'
//     }
// });
//
// MoneyTransferRoutes.route('/customer-report-gen', {
//     name: 'moneyTransfer.customerReportGen',
//     title: __('moneyTransfer.customerReport.title'),
//     action: function (params, queryParams) {
//         Layout.report('MoneyTransfer_customerReportGen');
//     }
// });
//
// // Order
// import '../imports/ui/reports/order.js';
// MoneyTransferRoutes.route('/order-report', {
//     name: 'moneyTransfer.orderReport',
//     title: __('moneyTransfer.orderReport.title'),
//     action: function (params, queryParams) {
//         Layout.main('MoneyTransfer_orderReport');
//     },
//     breadcrumb: {
//         //params: ['id'],
//         //queryParams: ['show', 'color'],
//         title: __('moneyTransfer.orderReport.title'),
//         icon: 'cart-plus',
//         parent: 'moneyTransfer.home'
//     }
// });
//
// MoneyTransferRoutes.route('/order-report-gen', {
//     name: 'moneyTransfer.orderReportGen',
//     title: __('moneyTransfer.orderReport.title'),
//     action: function (params, queryParams) {
//         Layout.report('MoneyTransfer_orderReportGen');
//     }
// });
