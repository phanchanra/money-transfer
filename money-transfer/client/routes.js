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
import '../../core/imports/ui/layouts/login';
import '../../core/imports/ui/layouts/main';

// Group
let MoneyTransferRoutes = FlowRouter.group({
    prefix: '/money-transfer',
    title: "Money Transfer",
    titlePrefix: 'Money Transfer > ',
    subscriptions: function (params, queryParams) {
//     this.register('files', Meteor.subscribe('files'));
    }
});

// Home
import '../imports/ui/pages/home.js';
MoneyTransferRoutes.route('/home', {
    name: 'moneyTransfer.home',
    title: 'Home',
    action(param, queryParam){
        Layout.main('MoneyTransfer_home');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Home',
        // icon: 'home',
        parent: 'core.welcome'
    }
});
// Transfer
import '../imports/ui/pages/transfer';
MoneyTransferRoutes.route('/transfer', {
    name: 'moneyTransfer.transfer',
    title: 'Transfer',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_transfer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Transfer',
        // icon: 'users',
        parent: 'moneyTransfer.home'
    }
});
// Customer
import '../imports/ui/pages/customer.js';
MoneyTransferRoutes.route('/customer', {
    name: 'moneyTransfer.customer',
    title: 'Customer',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_customer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Customer',
        // icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Fee
import '../imports/ui/pages/fee';
MoneyTransferRoutes.route('/fee', {
    name: 'moneyTransfer.fee',
    title: 'Fee',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_fee');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Fee',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
// Product
import '../imports/ui/pages/product.js';
MoneyTransferRoutes.route('/product', {
    name: 'moneyTransfer.product',
    title: 'Product',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_product');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Product',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

