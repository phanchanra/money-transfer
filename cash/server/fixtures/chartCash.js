import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/erasaur:meteor-lodash';

import {ChartCash} from '../../common/collections/chartCash.js';

Meteor.startup(function () {
    if (ChartCash.find().count() == 0) {
        var data = [
            // Can't change
            {name: 'បើកប្រាក់ដើមគ្រា', cashType: 'Opening', memo: ''},
            {name: 'បិទប្រាក់ចុងគ្រា', cashType: 'Closing', memo: ''},
            // Can custom
            {name: 'ចំណូលការបង់ការសិក្សា', cashType: 'In', memo: ''},
            {name: 'ចំណូលការលក់សម្ភារៈសិក្សា', cashType: 'In', memo: ''},
            {name: 'ចំណូលសេវាជួលជួលកុំព្យូទ័រ', cashType: 'In', memo: ''},
            {name: 'ចំណូលការលក់ប្រព័ន្ធគ្រប់គ្រង', cashType: 'In', memo: ''},
            {name: 'ចំណូលសេវាថែទាំប្រព័ន្ធគ្រប់គ្រង', cashType: 'In', memo: ''},
            {name: 'ចំណូលការបង្កើតគេហទំព័រ', cashType: 'In', memo: ''},
            {name: 'ចំណូលផ្សេងៗ', cashType: 'In', memo: ''},
            {name: 'ចំណាយប្រាក់ខែបុគ្គលិក និងប្រាក់រង្វាន់', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃជួលផ្ទះ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃចរន្តអគ្គីសនី', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃទឹក', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃសាំង', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃសេវាអ៊ីនធឺណេត', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃសម្ភារៈការិយាល័យ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃកាតទូរស័ព្ទ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃបញ្ចូលទឹកថ្នាំ និងថែទាំម៉ាស៊ីនព្រីន', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃថែទាំកុំព្យូទ័រ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃជួសជុល និងថែទាំយាន្តជំនិះ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃបេសកកម្មការងារ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃកំមីស្យុង', cashType: 'Out', memo: ''},
            {name: 'ចំណាយថ្លៃវិញ្ញាប័ណ្ណបត្រ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយលើចំណីអាហារ', cashType: 'Out', memo: ''},
            {name: 'ចំណាយផ្សេងៗ', cashType: 'Out', memo: ''},
        ];

        _.forEach(data, (value)=> {
            ChartCash.insert(value);
        });
    }
});