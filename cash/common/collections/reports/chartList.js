import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {AutoForm} from 'meteor/aldeed:autoform';
import {moment} from 'meteor/momentjs:moment';

// Method
import {SelectOptsMethod} from '../../../common/methods/select-opts-method';

// Lib
import {SelectOpts} from '../../../imports/libs/select-opts.js';

export const ChartListSchema = new SimpleSchema({
    cashType: {
        type: [String],
        label: "Cash type",
        autoform: {
            type: "select2",
            multiple: true,
            options: function () {
                return SelectOpts.cashType(false, true);
            }
        }
    },
});
