import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Exchange} from '../../../core/common/collections/exchange';
import {ChartCash} from '../collections/chartCash';
import {Transaction} from '../collections/transaction';

export let SelectOptsMethod = {};

SelectOptsMethod.exchange = new ValidatedMethod({
    name: 'cash.selectOptsMethod.exchange',
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

SelectOptsMethod.chartCash = new ValidatedMethod({
    name: 'cash.selectOptsMethod.chartCash',
    validate: null,
    run(options) {
        if (!this.isSimulation) {
            this.unblock();

            let list = [], selector = {};
            let searchText = options.searchText;
            let values = options.values;
            let params = options.params || {};

            if (searchText) {
                selector = {
                    $or: [
                        {_id: {$regex: searchText, $options: 'i'}},
                        {name: {$regex: searchText, $options: 'i'}}
                    ]
                };
            } else if (values.length) {
                selector = {_id: {$in: values}};
            }
            selector.cashType = params.cashType;

            let data = ChartCash.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = value._id + ' : ' + value.name;
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});

SelectOptsMethod.transaction = new ValidatedMethod({
    name: 'cash.selectOptsMethod.transaction',
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

            let data = Transaction.find(selector, {limit: 10});
            data.forEach(function (value) {
                let label = `${value._id} | Date: ` + moment(value.transactionDate).format('DD/MM/YYYY') + ` | Amount: ` + numeral(value.totalAmount).format('0,0.00');
                list.push({label: label, value: value._id});
            });

            return list;
        }
    }
});
