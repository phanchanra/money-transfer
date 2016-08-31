//import BigNumber from 'bignumber.js';
export const calculateAgentFee = function (customerFee, ownerFee) {
    //new BigNumber(customerFee);
    ///new BigNumber(ownerFee);
    return customerFee - ownerFee;
};