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
import {Provider} from '../collections/provider';
import {Promotion} from '../collections/promotion';
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
                        {name: {$regex: searchText, $options: 'i'}},
                        {telephone: {$regex: searchText, $options: 'i'}}
                    ],
                    branchId: params.branchId
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Customer.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value.name + ' : ' + value.telephone;
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
            let params = options.params || {};

            if (searchText && params.transferType) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ],
                    status: "E",
                    type: params.type
                };
            } else if (values.length) {
                params._id = {$in: values};
                params.status = "E";
                selector = params;
            } else {
                params.status = "E";
                selector = params;
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
//provider
SelectOptsMethod.provider = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.provider',
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


            let data = Provider.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});
//promotion
SelectOptsMethod.promotion = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.promotion',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;
            let currentDate=moment().toDate();
            if (searchText) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ],
                    //status: "E"
                };
            } else if (values.length) {
                selector = {_id: {$in: values},startDate: {$lt: moment(currentDate, "DD/MM/YYYY").add(1, 'days').toDate()},
                    expiredDate: {$gte: moment(currentDate, "DD/MM/YYYY").toDate()}};
            }else{
                selector = {tartDate: {$lt: moment(currentDate, "DD/MM/YYYY").add(1, 'days').toDate()},
                    expiredDate: {$gte: moment(currentDate, "DD/MM/YYYY").toDate()}};
            }


            let data = Promotion.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

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
                selector = {$text: {$search: searchText}};
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }

            let data = Exchange.find(selector, {limit: 10});
            data.forEach(function (value) {
                var label = moment(value.exDate).format('DD/MM/YYYY') +
                    ' | ' + numeral(value.rates.USD).format('0,0.00') + ' $' +
                    ' = ' + numeral(value.rates.KHR).format('0,0.00') + ' ៛' + ' = ' +
                    numeral(value.rates.THB).format('0,0.00') + ' B';

                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

/*******************
 * Borrowing
 ******************/
import {Borrowing} from '../collections/borrowing';
SelectOptsMethod.borrowing = new ValidatedMethod({
    name: 'moneyTransfer.selectOptsMethod.borrowing',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;
            let params = options.params || {};

            if (searchText) {
                selector.$text = {$search: searchText};
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }
            selector.status = 'Active';
            selector.customerId = params.customerId;

            let data = Borrowing.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' | Date: ' + moment(value.borrowingDate).format('DD/MM/YYYY') + ' | Amount: ' + numeral(value.borrowingAmount).format('0,0.00') + ' ' + value.currencyId;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});
