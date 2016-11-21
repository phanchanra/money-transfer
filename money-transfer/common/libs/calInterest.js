import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {CallPromiseMixin} from 'meteor/didericis:callpromise-mixin';
import {_} from 'meteor/erasaur:meteor-lodash';
import moment from 'moment';
import math from 'mathjs';
import {round2} from 'meteor/theara:round2';

export let CalInterest = function (opts = {}) {
    new SimpleSchema({
        amount: {
            type: Number,
            decimal: true
        },
        numOfDay: {
            type: Number
        },
        interestRate: {
            type: Number,
            decimal: true
        },
        method: {
            type: String
        },
        dayInMethod: {
            type: Number,
            optional: true
        },
        currencyId: {
            type: String,
            optional: true
        },
    }).validate(opts);

    // Get setting
    let dayOfRates = {
        weekly: 7,
        monthly: 30,
        yearly: 365,
    };

    // Rate per day
    let dayInMethod;
    if (opts.dayInMethod) {
        dayInMethod = opts.dayInMethod;
    } else {
        switch (opts.method) {
            case 'W': // Weekly
                dayInMethod = dayOfRates.weekly;
                break;
            case 'M': // Monthly
                dayInMethod = dayOfRates.monthly;
                break;
            case 'Y': // Yearly
                dayInMethod = dayOfRates.yearly;
                break;
        }
    }
    let ratePerDay, interest;
    ratePerDay = (opts.interestRate / 100) / dayInMethod;
    interest = opts.amount * opts.numOfDay * ratePerDay;

    // Check currency
    if (opts.currencyId == 'KHR') {
        interest = round2(interest, -2);
    } else if (opts.currencyId == 'USD') {
        interest = round2(interest, 2);
    } else if (opts.currencyId == 'THB') {
        interest = round2(interest, 0);
    }

    return interest;
};