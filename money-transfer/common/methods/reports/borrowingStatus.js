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

import {Borrowing} from '../../collections/borrowing';

export const borrowingStatusReport = new ValidatedMethod({
    name: 'simplePos.borrowingStatusReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(2000);

            let rptTitle, rptHeader, rptContent, rptFooter;

            let fDate = moment(params.rptDate[0]).toDate();
            let tDate = moment(params.rptDate[1]).add(1, 'days').toDate();

            // --- Title ---
            rptTitle = Company.findOne();

            // --- Header ---
            // Branch
            let branchDoc = Branch.find({_id: {$in: params.branchId}});
            params.branchHeader = _.map(branchDoc.fetch(), function (val) {
                return `${val._id} : ${val.enName}`;
            });

            // Exchange
            let exchangeDoc = Exchange.findOne(params.exchangeId);
            params.exchangeHeader = JSON.stringify(exchangeDoc.rates, null, ' ');

            rptHeader = params;

            // --- Content ---
            let selector = {};
            selector.branchId = {$in: params.branchId};
            selector.currencyId = {$in: params.currencyId};

            // Check status
            switch (params.status) {
                case "Active":
                    selector.activeDate = {$gte: fDate, $lte: tDate};
                    break;
                case 'Reschedule':
                    selector.rescheduleDate = {$gte: fDate, $lte: tDate};
                    break;
                case 'Close':
                    selector.closeDate = {$gte: fDate, $lte: tDate};
                    break;
            }

            rptContent = Borrowing.aggregate([
                {
                    $match: selector
                },
                {
                    $sort: {_id: -1}
                },
                {
                    $group: {
                        _id: "$currencyId",
                        dataByCurrency: {$addToSet: "$$ROOT"},
                        subTotalAmount: {
                            $sum: "$borrowingAmount"
                        },
                        subTotalInterest: {
                            $sum: "$projectInterest"
                        }
                    }
                },
                {
                    $sort: {_id: -1}
                },
                {
                    $group: {
                        _id: null,
                        data: {$addToSet: "$$ROOT"},
                        totalAmountAsUSD: calTotal("$subTotalAmount", exchangeDoc),
                        totalInterestAsUSD: calTotal("$subTotalInterest", exchangeDoc)
                    }
                }
            ])[0];

            return {rptTitle, rptHeader, rptContent};
        }
    }
});

function calTotal(fieldName, exchange) {
    return {
        $sum: {
            $cond: {
                if: {$eq: ["$_id", "KHR"]},
                then: {$divide: [fieldName, exchange.rates.KHR]},
                else: {
                    $cond: {
                        if: {$eq: ["$_id", "THB"]},
                        then: {$divide: [fieldName, exchange.rates.THB]},
                        else: fieldName
                    }
                }
            }
        }
    }
}