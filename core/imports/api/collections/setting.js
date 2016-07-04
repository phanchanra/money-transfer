import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {TAPi18n} from 'meteor/tap:i18n';

// Lib
import {SelectOpts} from '../../ui/libs/select-opts.js';
import {__} from '../../../common/libs/tapi18n-callback-helper.js';

export const Setting = new Mongo.Collection("core_setting");

Setting.schema = new SimpleSchema({
    headOffice: {
        type: String,
        label: __('core.setting.headOfficeLbl'),
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.branch();
            }
        }
    },
    baseCurrency: {
        type: String,
        label: __('core.setting.baseCurrencyLbl'),
        autoform: {
            type: "select2",
            options: function () {
                return SelectOpts.currency();
            }
        }
    },
    language: {
        type: String,
        label: __('core.setting.languageLbl'),
        autoform: {
            type: "select2",
            options: function () {
                return [
                    {label: 'En', value: 'en'},
                    {label: 'Km', value: 'km'}
                ];
            }
        }
    }
});

Setting.attachSchema(Setting.schema);
