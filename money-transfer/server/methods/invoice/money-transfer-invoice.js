import {Meteor} from 'meteor/meteor';
import {moneyTransferState} from '../../../common/globalState/moneyTransferState';
import {aggregate} from "meteor/meteorhacks:aggregate";
import {Customer} from '../../../common/collections/customer';
import {Product} from '../../../common/collections/product';
import {Company} from '../../../../core/common/collections/company';
import {Transfer} from '../../../common/collections/transfer'
Meteor.methods({
    invoice(tmpId){

        let doc = moneyTransferState.get(tmpId);

        if(doc==null){
            doc = Transfer.findOne(tmpId);
        }

        // fromThaiState.set({});
        if (doc) {
            doc.title=Company.findOne({});
            doc.sender = Customer.findOne(doc.senderId);
            doc.receiver = Customer.findOne(doc.receiverId);
            doc.product = Product.findOne(doc.productId);
            //console.log(doc);
            return doc;
        }
    }
});

