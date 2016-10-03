import {Meteor} from 'meteor/meteor';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

// Collection
import {ChartCash} from '../../common/collections/chartCash.js';

Meteor.publish('cash.chartCashById', function cashChartCash(chartCashId) {
    this.unblock();

    new SimpleSchema({
        chartCashId: {type: String},
    }).validate({chartCashId});

    if (!this.userId) {
        return this.ready();
    }

    Meteor._sleepForMs(200);

    return ChartCash.find({_id: chartCashId});
});
