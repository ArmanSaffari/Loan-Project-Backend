const getPaymentData = require("../payment/getPaymentData");

const evaluateLoaneligibility = async (data) => {
  // data must include userId and MembershipDate
  
  // conditions of  loan eligibility:
  // (1) all due membershipfees paid so far
  // (2) all due installments paid so far
  // (3) only one urgent and one normal loan is allowed at the same time
  let evaluation = {
    normal: {eligibility: false, amount: 0},
    urgent: {eligibility: false, amount: 0},
    message: ""
  };

  let userData = await getPaymentData({
    userId: data.userId,
    membershipDate: data.membershipDate
  });

  // (1) and (2):
  if (userData.memFeeRemained > 0 || userData.installmentRemained > 0) {
    evaluation.message = `You have already due payment. Due membership fee: `+
      `${Math.max(0, userData.memFeeRemained)}; Due installment: ${Math.max(0, userData.installmentRemained)} .`
  } else if (userData.memFeeToBePaid.lastMemFee == 0) {
    evaluation.message = `You must at least have a membership fee set on your account. `
  } else {
    // (3):
    // check eligibility for normal loan
    if (userData.numberOfLoans.active.normal == 0 && userData.numberOfLoans.requested.normal == 0) {
      evaluation.normal.eligibility = true;
      // eligible for three times the amount of membership fee has been paid so far with the maximum of 10,000
      evaluation.normal.amount = Math.min(10000, 3 * userData.memFee.sum);
      evaluation.message = `you are eligible for a normal loan up to ${evaluation.normal.amount}. `
    } else {
      evaluation.message = 'you are not eligible for a normal loan since you already have active normal loan. '
    }
    // check eligibility for urgent loan
    if (userData.numberOfLoans.active.urgent == 0 && userData.numberOfLoans.requested.urgent == 0) {
      evaluation.urgent.eligibility = true;
      // eligible for three times the amount of membership fee has been paid so far with the maximum of 10,000
      evaluation.urgent.amount = 500;
      evaluation.message = evaluation.message + `you are eligible for an urgent loan up to ${evaluation.urgent.amount}.`
    } else {
      evaluation.message = 'you are not eligible for an urgent loan since you already have active urgent loan. '
    }
  }
  return evaluation
}

module.exports = evaluateLoaneligibility;