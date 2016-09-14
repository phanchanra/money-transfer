import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Customer} from '../collections/customer.js';
import {Product} from '../collections/product';
import {Exchange} from '../../../core/common/collections/exchange';

export let SelectOptsMethod = {};

SelectOptsMethod.customer = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.customer',
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

SelectOptsMethod.product = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.product',
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
                    status: "E"
                };
            } else if (values.length) {
                selector = {_id: {$in: values}, status: "E"};
            } else {
                selector = {status: "E"}
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
// SelectOptsMethod.item = new ValidatedMethod({
//     name: 'moneyTransfer.selectOptsMethod.item',
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

SelectOptsMethod.exchange = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.exchange',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;

            if (searchText) {
                selector = {
                    _id: {$regex: searchText, $options: 'i'}
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Exchange.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = 'Date: ' + moment(value.exDate).format('DD/MM/YYYY')+ ' ' + value.base +'  '+ value.rates.USD + '=' + value.rates.KHR +'KHR'+ ' | ' + value.rates.THB+'THB';
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

