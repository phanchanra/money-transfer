import {Meteor} from 'meteor/meteor';
import {moneyTransferState} from '../../../common/libs/moneyTransferState';
import {senderGlobalState} from '../../../common/libs/senderState';
//import {receiverGlobalState} from '../../../common/libs/receiverState';
import {aggregate} from "meteor/meteorhacks:aggregate";
import {Customer} from '../../../common/collections/customer';
import {Product} from '../../../common/collections/product';
import {Company} from '../../../../core/common/collections/company';
import {Transfer} from '../../../common/collections/transfer';
import {ExchangeTransaction} from '../../../common/collections/exchange-transaction';
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
        let exchangeTran = ExchangeTransaction.findOne(doc.exchangeId);
        let exchangeItems = [];
        if (exchangeTran) {
            exchangeTran.items.forEach(function (obj) {
                exchangeItems.push({
                    baseCurrency: obj.baseCurrency,
                    baseAmount: obj.baseAmount,
                    toAmount: obj.toAmount,
                    convertTo: obj.convertTo
                })
            });
            if (exchangeItems[0]) {
                doc.convertToFirst = exchangeItems[0].convertTo;
                doc.baseAmountFirst = exchangeItems[0].baseAmount;
                doc.toAmountFirst = exchangeItems[0].toAmount;
            }
            if (exchangeItems[1]) {
                doc.toAmountSecond = exchangeItems[1].toAmount;
                doc.baseAmountSecond = exchangeItems[1].baseAmount;
                doc.convertToSecond = exchangeItems[1].convertTo;
            }
        }
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
                if (doc.sender) {
                    doc.title.senderAndReceiver = doc.sender.name;
                }
                doc.title.refCode = doc.bankNumber;
                doc.address = doc.receiver.address;
            }
        }
        //console.log(doc.exchangeItems);
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

