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
