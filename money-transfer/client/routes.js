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
    title: __('moneyTransfer.home.title'),
    action(param, queryParam){
        Layout.main('MoneyTransfer_home');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.home.title'),
        icon: 'home',
        parent: 'core.welcome'
    }
});
// Cash In
import '../imports/ui/pages/cash-in.js';
MoneyTransferRoutes.route('/cash-in', {
    name: 'moneyTransfer.cashIn',
    title: __('moneyTransfer.cashIn.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_cashIn');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.cashIn.title'),
        icon: 'product-hunt',
        parent: 'moneyTransfer.home'
    }
});


// Customer
import '../imports/ui/pages/customer.js';
MoneyTransferRoutes.route('/customer', {
    name: 'moneyTransfer.customer',
    title: __('moneyTransfer.customer.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_customer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.customer.title'),
        icon: 'users',
        parent: 'moneyTransfer.home'
    }
});

// Transfer from Thai
import '../imports/ui/pages/money-transfer';
MoneyTransferRoutes.route('/transfer', {
    name: 'moneyTransfer.transfer',
    title: __('moneyTransfer.transfer.title'),

    subscriptions: function (params, queryParams) {
        this.register('moneyTransfer.supplier', Meteor.subscribe('moneyTransfer.supplier'));
        this.register('moneyTransfer.customer', Meteor.subscribe('moneyTransfer.customer'));
    },
    action: function (params, queryParams) {
        //console.log(Session.get('checkSessionOntabular'));
        Layout.main('MoneyTransfer_transfer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.transfer.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// Transfer from Khmer
// import '../imports/ui/pages/from-khmer.js';
// MoneyTransferRoutes.route('/from-khmer', {
//     name: 'moneyTransfer.fromKhmer',
//     title: __('moneyTransfer.fromKhmer.title'),
//     action: function (params, queryParams) {
//         //console.log(Session.get('checkSessionOntabular'));
//
//         Layout.main('MoneyTransfer_fromKhmer');
//
//     },
//     breadcrumb: {
//         //params: ['id'],
//         //queryParams: ['show', 'color'],
//         title: __('moneyTransfer.fromKhmer.title'),
//         icon: 'user',
//         parent: 'moneyTransfer.home'
//     }
// });


// exchange
import '../imports/ui/pages/exchange.js';
MoneyTransferRoutes.route('/exchange', {
    name: 'moneyTransfer.exchange',
    title: __('moneyTransfer.exchange.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_exchange');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.exchange.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
// supplier
import '../imports/ui/pages/supplier.js';
MoneyTransferRoutes.route('/supplier', {
    name: 'moneyTransfer.supplier',
    title: __('moneyTransfer.supplier.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_supplier');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.supplier.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});
// service
import '../imports/ui/pages/service';
MoneyTransferRoutes.route('/service', {
    name: 'moneyTransfer.service',
    title: __('moneyTransfer.service.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_service');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.service.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});