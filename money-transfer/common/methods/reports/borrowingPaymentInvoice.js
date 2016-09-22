import {Meteor} from 'meteor/meteor';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import {moment} from  'meteor/momentjs:moment';

// Collection
import {Company} from '../../../../core/common/collections/company';
import {Branch} from '../../../../core/common/collections/branch';

import {BorrowingPayment} from '../../collections/borrowingPayment';

export const borrowingPaymentInvoiceReport = new ValidatedMethod({
    name: 'simplePos.borrowingPaymentInvoiceReport',
    mixins: [CallPromiseMixin],
    validate: null,
    run(params) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);

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
            selector._id = params.borrowingPaymentId;

            rptContent = BorrowingPayment.aggregate([
                {
                    $match: selector
                },
                {
                    $lookup: {
                        from: "moneyTransfer_borrowing",
                        localField: "borrowingId",
                        foreignField: "_id",
                        as: "borrowingDoc"
                    }
                },
                {
                    $unwind: "$borrowingDoc"
                }
            ])[0];

            return {rptTitle, rptHeader, rptContent};
        }
    }
});
