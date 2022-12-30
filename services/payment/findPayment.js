const Payment = require("../../models/payment");

const findPayment = async (paymentId) => {
  try {
    const foundPayment = await Payment.findOne({
      where: {
        id: paymentId
      }
    });
    return foundPayment.dataValues
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = findPayment;
