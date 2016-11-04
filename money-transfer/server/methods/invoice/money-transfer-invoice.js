import {Meteor} from 'meteor/meteor';
import {moneyTransferState} from '../../../common/libs/moneyTransferState';
import {senderGlobalState} from '../../../common/libs/senderState';
//import {receiverGlobalState} from '../../../common/libs/receiverState';
import {aggregate} from "meteor/meteorhacks:aggregate";
import {Customer} from '../../../common/collections/customer';
import {Product} from '../../../common/collections/product';
import {Company} from '../../../../core/common/collections/company';
import {Transfer} from '../../../common/collections/transfer'
Meteor.methods({
    invoice(tmpId){
        let doc = moneyTransferState.get(tmpId);
        if (doc == null) {
            doc = Transfer.findOne(tmpId);
        }
        doc.title = Company.findOne({});
        doc.sender = Customer.findOne(doc.senderId);
        doc.receiver = Customer.findOne(doc.receiverId);
        doc.product = Product.findOne(doc.productId);
        //console.log(doc);
        doc.title.invoiceId = doc._id;
        //doc.title.dateTimeNote = doc.dateTimeNote;
        if (doc.transferType == 'khmer') {
            doc.title.transferTypeIn = 'ខ្មែរ';
            doc.title.dateNote = '';
            doc.title.timeNote = '';
            doc.title.refCode = doc.refCode;
            if (doc.type == 'IN') {
                doc.title.transferReveive = "ទទួល";
            }else{
                doc.title.transferReveive = "ផ្ទេរ";
            }
        } else {
            if (doc.type == 'IN') {
                doc.title.transferTypeIn = 'ថៃ';
                doc.title.dateNote = doc.dateNote;
                doc.title.timeNote = doc.timeNote;
                doc.title.transferReveive = "ទទួល";
                doc.title.senderAndReceiver = doc.receiver.name;
                doc.title.refCode = '';
            } else {
                doc.title.transferTypeIn = 'ថៃ';
                doc.title.transferReveive = "ផ្ទេរ";
                doc.title.senderAndReceiver = doc.sender.name;
                doc.title.refCode = doc.bankNumber;
            }
        }

        return doc;
    },
    getSenderDoc(tmpId){
        let doc = senderGlobalState.get(tmpId);
        delete senderGlobalState._obj[tmpId];
        return doc;
    },
    // getReveiverDoc(tmpId){
    //     let doc = receiverGlobalState.get(tmpId);
    //     delete receiverGlobalState._obj[tmpId];
    //     return doc;
    // }
});

