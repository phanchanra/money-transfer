import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';

// Collection
import {ChartCash} from '../collections/chartCash.js';

export const chartCash = new ValidatedMethod({
    name: 'cash.chartCash',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        chartId: {type: String}
    }).validator(),
    run({chartId}) {
        if (!this.isSimulation) {
            return ChartCash.findOne({_id: chartId});
        }
    }
});