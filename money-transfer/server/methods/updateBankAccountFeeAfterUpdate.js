import {Transfer} from '../../common/collections/transfer';
import {Fee} from '../../common/collections/fee';
Meteor.methods({
   updateBankAccountFeeAfterUpdate({doc, preDoc}){
       //console.log(doc);
       let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
       //condition 1 CD => CD
       let resultAmountCDCD = preDoc.amount - doc.amount;
       let newBalanceAmountCDCD = preDoc.balanceAmount - resultAmountCDCD;
       //condition 2 CD => CW
       let resultAmountCDCW = preDoc.amount + doc.amount;
       let newBalanceAmountCDCW = preDoc.balanceAmount - resultAmountCDCW;
       //condition 3 CW => CW
       let resultAmountCWCW = preDoc.balanceAmount - doc.amount;
       let newBalanceAmountCWCW = preDoc.amount + resultAmountCWCW;
       //condition 4 CW => CD
       let resultAmountCWCD = preDoc.amount + preDoc.balanceAmount;
       let newBalanceAmountCWCD = resultAmountCWCD + doc.amount;

       Meteor.defer(function () {
           if (preDoc.type == doc.type && doc.type == "CD") {
               Transfer.direct.update(
                   doc._id, {
                       $set: {
                           amount: doc.amount,
                           balanceAmount: newBalanceAmountCDCD
                       }
                   }
               );
               Fee.direct.update(
                   fee._id,
                   {
                       $set: {
                           os: {
                               date: Date.now(),
                               balanceAmount: newBalanceAmountCDCD,
                               balanceAmountFee: newBalanceAmountCDCD
                           }
                       }
                   }
               );
           } else if (preDoc.type != doc.type && doc.type == "CW") {
               Transfer.direct.update(
                   doc._id, {
                       $set: {
                           amount: doc.amount,
                           balanceAmount: newBalanceAmountCDCW
                       }
                   }
               );
               Fee.direct.update(
                   fee._id,
                   {
                       $set: {
                           os: {
                               date: new Date(),
                               balanceAmount: newBalanceAmountCDCW,
                               balanceAmountFee: newBalanceAmountCDCW,
                           }
                       }
                   }
               );
           } else if (preDoc.type == doc.type && doc.type == "CW") {
               Transfer.direct.update(
                   doc._id, {
                       $set: {
                           amount: doc.amount,
                           balanceAmount: newBalanceAmountCWCW
                       }
                   }
               );
               Fee.direct.update(
                   fee._id,
                   {
                       $set: {
                           os: {
                               date: new Date(),
                               balanceAmount: newBalanceAmountCWCW,
                               balanceAmountFee: newBalanceAmountCWCW,
                           }
                       }
                   }
               );
           } else if (preDoc.type != doc.type && doc.type == "CD") {
               Transfer.direct.update(
                   doc._id, {
                       $set: {
                           amount: doc.amount,
                           balanceAmount: newBalanceAmountCWCD
                       }
                   }
               );
               Fee.direct.update(
                   fee._id,
                   {
                       $set: {
                           os: {
                               date: new Date(),
                               balanceAmount: newBalanceAmountCWCD,
                               balanceAmountFee: newBalanceAmountCWCD,
                           }
                       }
                   }
               );
           }
       });
   }
});