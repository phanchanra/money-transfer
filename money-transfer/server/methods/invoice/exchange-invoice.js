import {Meteor} from 'meteor/meteor';
import {exchangeState} from '../../../common/libs/exchangeState';
import {aggregate} from "meteor/meteorhacks:aggregate";
import {Customer} from '../../../common/collections/customer';
//import {Product} from '../../../common/collections/product';
import {Company} from '../../../../core/common/collections/company';
import {ExchangeTransaction} from '../../../common/collections/exchange-transaction';
Meteor.methods({
    exchangeInvoice(tmpId){
        let doc = exchangeState.get(tmpId);
        //let i = 1;
        if (doc == null) {
            doc = ExchangeTransaction.findOne(tmpId);
        }
        doc.title = Company.findOne({});
        doc.customer = Customer.findOne(doc.customerId);
        doc.title.invoiceId = doc._id;
        // doc.title.customer = doc.customer.name;
        //doc.increase = i++;
        return doc;
    }
});

