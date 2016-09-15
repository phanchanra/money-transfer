import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company';
import {Branch} from '../../../../core/common/collections/branch';

import {Borrowing} from '../../collections/borrowing';

export const borrowingInvoiceReport = new ValidatedMethod({
    name: 'simplePos.borrowingInvoiceReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(2000);

            let rptTitle, rptHeader, rptContent, rptFooter;

            // --- Title ---
            rptTitle = Company.findOne();

            // --- Header ---
            // Branch
            let branchDoc = Branch.findOne({_id: params.branchId});
            params.branchHeader = `${branchDoc._id} : ${branchDoc.enName}`;

            rptHeader = params;

            // --- Content ---
            let selector = {};
            selector._id = params.borrowingId;

            rptContent = Borrowing.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_customer",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDoc"
                    }
                },
                {
                    $unwind: "$customerDoc"
                }
            ])[0];

            return {rptTitle, rptHeader, rptContent};
        }
    }
});
