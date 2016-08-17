import {Supplier} from '../../imports/api/collections/supplier';
//import {Service} from '../../imports/api/collections/service';
Meteor.methods({
    getSupplierId(supplierId){
        let supplierStatus = Supplier.findOne({_id:supplierId});
        if (supplierStatus) {
            return supplierStatus.status;
        }
        else {
            return '';
        }
    }
});