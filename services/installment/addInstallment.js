const Installment = require("../../models/installment");
const sequelize = require("../../configs/db");

const addInstallment = async (data) => {
  try {
    //data include paymentId, amount, loanId
    await Installment.create(data);
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = addInstallment;