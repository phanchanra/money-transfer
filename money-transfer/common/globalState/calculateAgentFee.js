import BigNumber from 'bignumber.js';
export const calculateAgentFee = function (customerFee, ownerFee) {
    return new BigNumber (customerFee).minus(ownerFee).toNumber();
};