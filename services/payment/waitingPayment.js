const Payment = require("../../models/payment");

const waitingPayment = async () => {
  try {
    const foundPayments = await Payment.findAll({
      order: [["paymentDate", "ASC"]],
      where: {
        confirmation: false
      }
    });
    // return (foundPayments.length === 0) ? false : foundPayments.map((row)=> row.dataValues)
    return foundPayments
  }
  catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = waitingPayment;