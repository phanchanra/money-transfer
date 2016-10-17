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
import '../../core/imports/layouts/login';
import '../../core/imports/layouts/main';

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
import '../imports/pages/home.js';
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

/*****************
 * Transfer
 ****************/
// Transfer
import '../imports/pages/transfer';
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
import '../imports/pages/customer.js';
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
// Product
import '../imports/pages/product.js';
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
// Fee
import '../imports/pages/fee';
MoneyTransferRoutes.route('/product-fee', {
    name: 'moneyTransfer.fee',
    title: 'Product Fee',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_fee');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Product Fee',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
// Bank Account
import '../imports/pages/bank-account';
MoneyTransferRoutes.route('/bank-account/:productId/:currencyId', {
    name: 'moneyTransfer.bankAccount',
    title: 'Bank Account',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_bankAccount');
    },
    breadcrumb: {
        params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Bank Account',
        // icon: 'user',
        parent: 'moneyTransfer.fee'
    }
});

// Customer Expired Lis
import '../imports/pages/customerExpiredDate';
MoneyTransferRoutes.route('/customer-expired-date', {
    name: 'moneyTransfer.customerExpiredDate',
    title: 'Customer Expired Date',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_customerExpiredDate');
    },
    breadcrumb: {
        // params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Customer Expired Date',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
// Promotion
import '../imports/pages/promotion';
MoneyTransferRoutes.route('/promotion', {
    name: 'moneyTransfer.promotion',
    title: 'Promotion',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_promotion');
    },
    breadcrumb: {
        title: 'Promotion',
        parent: 'moneyTransfer.home'
    }
});
/*****************
 * Exchange
 ****************/
//Provider
import '../imports/pages/provider';
MoneyTransferRoutes.route('/provider', {
    name: 'moneyTransfer.provider',
    title: 'Provider',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_provider');
    },
    breadcrumb: {
        // params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Provider',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
//Exchange Rate
import '../imports/pages/exchange-rate';
MoneyTransferRoutes.route('/exchange-rate', {
    name: 'moneyTransfer.exchangeRate',
    title: 'Exchange Rate',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_exchangeRate');
    },
    breadcrumb: {
        // params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Exchange Rate',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
//Exchange Transaction
import '../imports/pages/exchange-transaction';
MoneyTransferRoutes.route('/exchange-transaction', {
    name: 'moneyTransfer.exchangeTransaction',
    title: 'Exchange Transaction',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_exchangeTransaction');
    },
    breadcrumb: {
        // params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Exchange Transaction',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

/*****************
 * Borrowing
 ****************/
// Borrowing
import '../imports/pages/borrowing';
MoneyTransferRoutes.route('/borrowing', {
    name: 'moneyTransfer.borrowing',
    title: 'Borrowing',
    subscriptions: function (params, queryParams) {
        // this.register('customer', Meteor.subscribe('moneyTransfer.customer'));
    },
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowing');
    },
    breadcrumb: {
        // params: ['productId', 'currencyId'],
        //queryParams: ['show', 'color'],
        title: 'Borrowing',
        // icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// Payment
import '../imports/pages/borrowingPayment';
MoneyTransferRoutes.route('/borrowing-payment/:borrowingId', {
    name: 'moneyTransfer.borrowingPayment',
    title: 'Borrowing Payment',
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_borrowingPayment');
    },
    breadcrumb: {
        params: ['borrowingId'],
        //queryParams: ['show', 'color'],
        title: 'Payment',
        // icon: 'user',
        parent: 'moneyTransfer.borrowing'
    }
});
