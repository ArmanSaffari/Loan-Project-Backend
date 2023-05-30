const Payment = require("../../models/payment");

const countPaymentsByUser = async (data) => {
  try {
    const countOfPayments = await Payment.count({
      where: {
        UserId: data.userId,
        ...data.filter
      }
    });

    return countOfPayments
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = countPaymentsByUser;
