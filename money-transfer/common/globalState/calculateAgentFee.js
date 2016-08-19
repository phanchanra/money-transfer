export const calculateAgentFee = function (customerFee, ownerFee) {
    let agentFee = customerFee - ownerFee;
    return agentFee;
};