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
        //console.log(doc.receiver.address);
        doc.title.invoiceId = doc._id;
        //doc.title.dateTimeNote = doc.dateTimeNote;
        if (doc.transferType == 'khmer') {
            doc.title.transferTypeIn = 'ខ្មែរ~ខ្មែរ';
            doc.title.refCode = doc.refCode;
            if (doc.type == 'IN') {
                doc.title.transferReveive = "ទទួល";
                doc.address = doc.receiver.address;
                doc.title.senderAndReceiver = doc.receiver.name;
            } else {
                doc.title.transferReveive = "ផ្ទេរ";
                doc.address = doc.sender.address;
                doc.title.senderAndReceiver = doc.sender.name;
            }
        } else {
            if (doc.type == 'IN') {
                doc.title.transferTypeIn = 'ថៃ~ខ្មែរ';
                doc.title.dateNote = doc.dateNote;
                doc.title.timeNote = doc.timeNote;
                doc.title.transferReveive = "ទទួល";
                doc.title.senderAndReceiver = doc.receiver.name;
                doc.title.refCode = '';
                doc.address = doc.receiver.address;
            } else {
                doc.title.transferTypeIn = 'ខ្មែរ~ថៃ';
                doc.title.transferReveive = "ផ្ទេរ";
                if (doc.sender != null) {
                    doc.title.senderAndReceiver = doc.sender.name;
                }
                doc.title.refCode = doc.bankNumber;
                doc.address = doc.receiver.address;
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

