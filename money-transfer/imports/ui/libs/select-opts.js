import {Meteor} from  'meteor/meteor';
import {_} from 'meteor/erasaur:meteor-lodash';

// Collection
import {Branch} from '../../../../core/imports/api/collections/branch.js';
import {Currency} from '../../../../core/imports/api/collections/currency';
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
    currency: function (selectOne=true) {
        let list=[];
        if(selectOne){
            Currency.find()
                .forEach(function (obj) {
                    list.push({label: obj._id, value:obj._id});
                });
        }
        return list;
    }

};