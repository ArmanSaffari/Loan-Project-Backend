const Payment = require("../../models/payment");

const updatePayment = async (paymentId, confirmedBy) => {
  try {
    const foundPayment = await Payment.findOne({
      where: {
        id: paymentId
      }
    });
    // console.log(foundPayment.dataValues)
    if (foundPayment === null) {
      console.log(`nothing found for id of ${paymentId}`)
    } else if (foundPayment.dataValues.confirmation === true) {
      console.log(`payment with id of ${paymentId} is already confirmed!`)
    } else {
      await foundPayment.update({
        confirmation: true,
        confirmedAdminId: confirmedBy
      });
    }
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = updatePayment;
