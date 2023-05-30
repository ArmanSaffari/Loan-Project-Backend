const payment = require("../../models/payment");

const addPayment = async (data) => {
  await payment.create(data);
};

module.exports = addPayment;