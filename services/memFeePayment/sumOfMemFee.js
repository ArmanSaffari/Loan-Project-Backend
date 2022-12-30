const findMemFeePayments = require("./findMemFeePayments");

const sumOfMemFee = async (userId) => {
  const memFeePayments = await findMemFeePayments(userId);
  const sum = memFeePayments.reduce((accumulator, value) => {
    return parseFloat(accumulator) + parseFloat(value.amount);
  }, 0);
  return {
    count: memFeePayments.length,
    sum: sum
  }
};

module.exports = sumOfMemFee;