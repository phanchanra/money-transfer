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
let SimplePOSRoutes = FlowRouter.group({
    prefix: '/cash',
    title: "Cash",
    titlePrefix: 'Cash > ',
    subscriptions: function (params, queryParams) {
//     this.register('files', Meteor.subscribe('files'));
    }
});

// Home
import '../imports/pages/home.js';
SimplePOSRoutes.route('/home', {
    name: 'cash.home',
    title: __('cash.home.title'),
    action(param, queryParam){
        Layout.main('Cash_home');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: __('cash.home.title'),
        icon: 'home',
        parent: 'core.welcome'
    }
});

// Lookup Value
import '../imports/pages/lookup-value.js';
SimplePOSRoutes.route('/lookup-value', {
    name: 'cash.lookupValue',
    title: 'Lookup Value',
    action: function (params, queryParams) {
        Layout.main('Cash_lookupValue');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Lookup Value',
        // icon: 'asterisk',
        parent: 'cash.home'
    }
});

// Chart Cash
import '../imports/pages/chartCash.js';
SimplePOSRoutes.route('/chartCash', {
    name: 'cash.chartCash',
    title: 'Chart Cash',
    action: function (params, queryParams) {
        Layout.main('Cash_chartCash');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Chart Cash',
        // icon: 'product-hunt',
        parent: 'cash.home'
    }
});

// Transaction
import '../imports/pages/transaction.js';
SimplePOSRoutes.route('/transaction', {
    name: 'cash.transaction',
    title: 'Transaction',
    action: function (params, queryParams) {
        Layout.main('Cash_transaction');
    },
    breadcrumb: {
        //params: ['id'],
        //queryParams: ['show', 'color'],
        title: 'Transaction',
        // icon: 'cart-plus',
        parent: 'cash.home'
    }
});
