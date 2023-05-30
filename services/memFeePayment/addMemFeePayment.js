const membershipPayment = require("../../models/membershipPayment");
const sequelize = require("../../configs/db");

const addMemFeePayment = async (data) => {
  try {
    //data include paymentId, amount
    await membershipPayment.create(data);
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = addMemFeePayment;