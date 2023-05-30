const Payment = require("../../models/payment");

const deleteWaitingPayment = async (recordId) => {
  try {
    await Payment.destroy({
      where: {
        id: recordId
      }
    })
    return {message: "The record deleted successfully!"};
  } catch (err) {
    return err
  }
};

module.exports = deleteWaitingPayment;