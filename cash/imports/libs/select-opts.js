import {Meteor} from  'meteor/meteor';
import {_} from 'meteor/erasaur:meteor-lodash';

// Collection
import {LookupValue} from '../../common/collections/lookup-value';
import {Branch} from '../../../core/common/collections/branch';
import {Currency} from '../../../core/common/collections/currency';

export const SelectOpts = {
    lookupValue: function (name, selectOne = true) {
        let list = [];
        if (selectOne) {
            list.push({label: "(Select One)", value: ""});
        }

        // Get lookup value
        let lookup = LookupValue.findOne({name: name});
        if (lookup) {
            let options = _.orderBy(lookup.options, ['order'], ['asc']);
            list = _.concat(list, options);
        }

        return list;
    },
    cashType: function (selectOne, getOpeningClosingType) {
        var list = [];
        if (selectOne) {
            list.push({label: "(Select One)", value: ""});
        }

        if (getOpeningClosingType) {
            list.push({label: 'Opening', value: 'Opening'});
            list.push({label: 'Closing', value: 'Closing'});
        }

        list.push({label: 'In', value: 'In'});
        list.push({label: 'Out', value: 'Out'});

        return list;
    },
    branch: function (selectOne) {
        let list = [];
        if (selectOne) {
            list.push({label: "(Select One)", value: ""});
        }

        Branch.find().forEach(function (obj) {
            list.push({label: obj.enName, value: obj._id});
        });

        return list;
    },
    currency: function (selectOne, selector = {}) {
        let list = [];
        if (selectOne) {
            list.push({label: '(Select One)', value: ''});
        }

        Currency.find(selector).forEach(function (obj) {
            list.push({label: obj._id + ' (' + obj.num + ')', value: obj._id})
        });

        return list;
    },
};