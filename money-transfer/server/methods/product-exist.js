import {Fee} from '../../common/collections/fee';
Meteor.methods({
    productExist: function(id) {
            return Fee.findOne({productId:id});
    }
});