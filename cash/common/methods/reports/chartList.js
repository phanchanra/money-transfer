import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company';
import {Branch} from '../../../../core/common/collections/branch';
import {Exchange} from '../../../../core/common/collections/exchange';

import {ChartCash} from '../../collections/chartCash';

export const chartListReport = new ValidatedMethod({
    name: 'cash.chartListReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

            let rptTitle, rptHeader, rptContent;

            // --- Title ---
            rptTitle = Company.findOne();

            // --- Header ---
            rptHeader = params;

            // --- Content ---
            let selector = {};
            selector.cashType = {$in: params.cashType};

            rptContent = ChartCash.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {_id: 1}
                },
                {
                    $group: {
                        _id: "$cashType",
                        charts: {$push: "$$ROOT"}
                    }
                },
                {
                    $sort: {_id: 1}
                }
            ]);

            return {rptTitle, rptHeader, rptContent};
        }
    }
});

function sumAmount(currencyId) {
    return {
        $sum: {
            $cond: {
                if: {
                    $eq: ["$_id.currencyId", currencyId]
                },
                then: "$sumAmount",
                else: 0
            }
        }
    }
}