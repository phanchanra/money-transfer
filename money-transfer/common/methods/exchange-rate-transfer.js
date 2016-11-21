import BigNumber from 'bignumber.js';
BigNumber.config({ERRORS: false});
Meteor.methods({
    exchangeRateTransfer (baseCurrency, convertTo, baseAmount, selling) {
        if (baseCurrency && convertTo && baseAmount && selling) {
            let convertAmount = {};
            if (baseCurrency == 'KHR') {
                if (convertTo == 'USD') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(selling))).toFixed(2);
                } else if (convertTo == 'THB') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(selling))).toFixed(2);
                }
            } else if (baseCurrency == 'USD') {
                if (convertTo == 'KHR') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(selling)).toFixed(2);
                } else if (convertTo == 'THB') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(selling)).toFixed(2);
                }
            } else {
                if (convertTo == 'KHR') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(selling)).toFixed(2);
                } else if (convertTo == 'USD') {
                    convertAmount = new BigNumber(baseAmount).times(new BigNumber(1).div(new BigNumber(selling))).toFixed(2);
                }
            }
            return convertAmount;
        } else {
            throw new Meteor.Error("Don't have any exchange Rate.");
        }

    }
});