import {Fee} from '../../common/collections/fee';
Meteor.methods({
   updateFeeAfterInsertTransfer({doc}){
       let fee = Fee.findOne({productId: doc.productId, currencyId: doc.currencyId});
       if (doc.type == "IN") {
           //check when discount fee
           let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
           Fee.direct.update(
               fee._id,
               {
                   $set: {
                       os: {
                           date: new Date(),
                           balanceAmount: fee.os.balanceAmount + doc.amount,
                           customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                           ownerFee: fee.os.ownerFee == null ? doc.feeDoc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                           agentFee: fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee,
                           // agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                           // balanceAmountFee: (fee.os.balanceAmountFee + doc.amount) + doc.feeDoc.agentFee
                           balanceAmountFee: (fee.os.balanceAmountFee + doc.amount) + agentFee
                       }
                   }
               }
           );
           Meteor.call('updateCustomerExpireDay', {doc});

       } else if (doc.type == "OUT") {
           //check when discount fee
           let agentFee = doc.totalFee - doc.feeDoc.ownerFee;
           Fee.direct.update(
               fee._id,
               {
                   $set: {
                       os: {
                           date: new Date(),
                           balanceAmount: fee.os.balanceAmount - doc.amount,
                           customerFee: fee.os.customerFee == null ? doc.customerFee : fee.os.customerFee + doc.customerFee,
                           ownerFee: fee.os.ownerFee == null ? doc.ownerFee : fee.os.ownerFee + doc.feeDoc.ownerFee,
                           agentFee: fee.os.agentFee == null ? agentFee : fee.os.agentFee + agentFee,
                           // agentFee: fee.os.agentFee == null ? doc.feeDoc.agentFee : fee.os.agentFee + doc.feeDoc.agentFee,
                           // balanceAmountFee: (fee.os.balanceAmountFee + doc.feeDoc.agentFee) - doc.amount
                           balanceAmountFee: (fee.os.balanceAmountFee + agentFee) - doc.amount
                       }
                   }
               }
           );
           Meteor.call('updateCustomerExpireDay', {doc});
       }
   }
});