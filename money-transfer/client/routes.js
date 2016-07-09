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

// Item
import '../imports/ui/pages/item.js';
MoneyTransferRoutes.route('/item', {
    name: 'moneyTransfer.item',
    title: __('moneyTransfer.item.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_item');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.item.title'),
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

// Order
import '../imports/ui/pages/order.js';
MoneyTransferRoutes.route('/order', {
    name: 'moneyTransfer.order',
    title: __('moneyTransfer.order.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_order');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.order.title'),
        icon: 'cart-plus',
        parent: 'moneyTransfer.home'
    }
});

// Sender
import '../imports/ui/pages/sender.js';
MoneyTransferRoutes.route('/sender', {
    name: 'moneyTransfer.sender',
    title: __('moneyTransfer.sender.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_sender');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.sender.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// Receiver
import '../imports/ui/pages/receiver.js';
MoneyTransferRoutes.route('/receiver', {
    name: 'moneyTransfer.receiver',
    title: __('moneyTransfer.receiver.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_receiver');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.receiver.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// ThaiBank
import '../imports/ui/pages/thai-bank.js';
MoneyTransferRoutes.route('/thai-bank', {
    name: 'moneyTransfer.thaiBank',
    title: __('moneyTransfer.thaiBank.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_thaiBank');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.thaiBank.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// ThaiService
import '../imports/ui/pages/thai-service.js';
MoneyTransferRoutes.route('/thai-service', {
    name: 'moneyTransfer.thaiService',
    title: __('moneyTransfer.thaiService.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_thaiService');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.thaiService.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// Transfer from Thai
import '../imports/ui/pages/from-thai.js';
MoneyTransferRoutes.route('/from-thai', {
    name: 'moneyTransfer.fromThai',
    title: __('moneyTransfer.fromThai.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_fromThai');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.fromThai.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});

// Transfer from Khmer
import '../imports/ui/pages/from-khmer.js';
MoneyTransferRoutes.route('/from-khmer', {
    name: 'moneyTransfer.fromKhmer',
    title: __('moneyTransfer.fromKhmer.title'),
    action: function (params, queryParams) {
        Layout.main('MoneyTransfer_fromKhmer');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('moneyTransfer.fromKhmer.title'),
        icon: 'user',
        parent: 'moneyTransfer.home'
    }
});