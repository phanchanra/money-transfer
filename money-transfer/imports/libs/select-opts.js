import {Meteor} from  'meteor/meteor';
import {_} from 'meteor/erasaur:meteor-lodash';

// Collection
import {Branch} from '../../../core/common/collections/branch.js';
import {Currency} from '../../../core/common/collections/currency';
import {Product} from '../../common/collections/product';

export const SelectOpts = {
    branch: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: "(Select One)", value: ""});
        }

        Branch.find()
            .forEach(function (obj) {
                list.push({label: obj.enName, value: obj._id});
            });

        return list;
    },
    gender: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: '(Select One)', value: ''});
        }
        list.push({label: "Male", value: "M"});
        list.push({label: "Female", value: "F"});

        return list;
    },
    currency: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            Currency.find()
                .forEach(function (obj) {
                    list.push({label: obj._id, value: obj._id});
                });
        }
        return list;
    },
    //Exchange Rate condition when deduct self
    currencyExchange: function (selectOne = true) {
        let list = [];
        let selector = {};
        let baseCurrency = Session.get("baseCurrency");
        if (baseCurrency) {
            selector._id = {$ne: baseCurrency}
        }
        if (selectOne) {
            Currency.find(selector)
                .forEach(function (obj) {
                    list.push({label: obj._id, value: obj._id});
                });
        }
        return list;
    },
    product: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            Product.find()
                .forEach(function (obj) {
                    list.push({label: obj._id + "-" + obj.name, value: obj._id});
                });
        }
        return list;
    },
    transfer: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: '(Select One)', value: ''});
        }
        list.push({label: "IN", value: "IN"});
        list.push({label: "OUT", value: "OUT"});

        return list;
    },
    depositWithdrawal: function (selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: '(Select One)', value: ''});
        }
        list.push({label: "CD", value: "CD"});
        list.push({label: "CW", value: "CW"});

        return list;
    },

};