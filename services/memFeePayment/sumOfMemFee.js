const findMemFeePayments = require("./findMemFeePayments");

const sumOfMemFee = async (userId) => {
  try {
    const memFeePayments = await findMemFeePayments({ userId });
    console.log(memFeePayments)

    const sum = memFeePayments.reduce((accumulator, value) => {
      return parseFloat(accumulator) + parseFloat(value.amount);
    }, 0);
    return {
      count: memFeePayments.length,
      sum: sum
    }
  } catch (error) {
    throw error
  }
};

module.exports = sumOfMemFee;