const Payment = require("../../models/payment");

const findPaymentByUser = async (userId) => {
  try {
    const foundPayments = await Payment.findAll({
      // attributes: ['id'],
      where: {
        Userid: userId
      }
    });
    return foundPayments.map( row => row.dataValues);
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = findPaymentByUser;
