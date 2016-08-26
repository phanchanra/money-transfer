import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Customer} from '../../imports/api/collections/customer.js';
import {Product} from '../../imports/api/collections/product';
import {MoneyTransfer} from '../../imports/api/collections/transfer';

export let SelectOptMethods = {};

SelectOptMethods.customer = new ValidatedMethod({
    name: 'moneyTransfer.selectOptMethods.customer',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;
            let params = options.params || {};

            if (searchText && params.branchId) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ],
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Customer.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

SelectOptMethods.product = new ValidatedMethod({
    name: 'moneyTransfer.selectOptMethods.product',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ],
                    status:"E"
                };
            } else if (values.length) {
                selector = {_id: {$in: values},status:"E"};
            }else{
                selector={status:"E"}
            }


            let data = Product.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});
// SelectOptMethods.item = new ValidatedMethod({
//     name: 'moneyTransfer.selectOptMethods.item',
//     validate: null,
//     run(options) {
//         if (!this.isSimulation) {
//             this.unblock();
//
//             let list = [], selector = {};
//             let searchText = options.searchText;
//             let values = options.values;
//
//             if (searchText) {
//                 selector = {
//                     $or: [
//                         {_id: {$regex: searchText, $options: 'i'}},
//                         {name: {$regex: searchText, $options: 'i'}}
//                     ]
//                 };
//             } else if (values.length) {
//                 selector = {_id: {$in: values}};
//             }
//
//             let data = Item.find(selector, {limit: 10});
//             data.forEach(function (value) {
//                 let label = value._id + ' : ' + value.name;
//                 list.push({label: label, value: value._id});
//             });
//
//             return list;
//         }
//     }
// });

// SelectOptMethods.product = new ValidatedMethod({
//     name: 'moneyTransfer.selectOptMethods.product',
//     validate: null,
//     run(options) {
//         if (!this.isSimulation) {
//             this.unblock();
//
//             let list = [], selector = {};
//             let searchText = options.searchText;
//             let values = options.values;
//
//             if (searchText) {
//                 selector = {
//                     _id: {$regex: searchText, $options: 'i'},
//                     branchId: params.branchId
//                 };
//             } else if (values.length) {
//                 selector = {_id: {$in: values}};
//             }
//
//             let data = Product.find(selector, {limit: 10});
//             data.forEach(function (value) {
//                 let label = value._id + ' | Date: ' + moment(value.productDate).format('DD/MM/YYYY');
//                 list.push({label: label, value: value._id});
//             });
//
//             return list;
//         }
//     }
// });
SelectOptMethods.fromThai = new ValidatedMethod({
    name: 'moneyTransfer.selectOptMethods.fromThai',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    _id: {$regex: searchText, $options: 'i'},
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = MoneyTransfer.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' | Date: ' + moment(value.orderDate).format('DD/MM/YYYY');
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});
