import {Meteor} from 'meteor/meteor';
import {moneyTransferState} from '../../../common/globalState/moneyTransferState';
import {MoneyTransfer} from "../../../imports/api/collections/money-transfer";
import {aggregate} from "meteor/meteorhacks:aggregate";
import {Customer} from '../../../imports/api/collections/customer';
import {Supplier} from '../../../imports/api/collections/supplier';
import {Company} from '../../../../core/imports/api/collections/company';

Meteor.methods({
    moneyTransferInvoice(tmpId){

        let doc = moneyTransferState.get(tmpId);

        if(doc==null){
            doc = MoneyTransfer.findOne(tmpId);
        }

        // fromThaiState.set({});
        if (doc) {
            doc.title=Company.findOne({});
            doc.sender = Customer.findOne(doc.senderId);
            doc.receiver = Customer.findOne(doc.receiverId);
            doc.supplier = Supplier.findOne(doc.supplierId);
            //console.log(doc);
            return doc;
        }
    }
});

