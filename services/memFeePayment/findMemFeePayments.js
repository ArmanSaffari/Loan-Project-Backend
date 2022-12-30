const MemFeePayment = require("../../models/membershipPayment");
const Payment = require("../../models/payment");

const sequelize = require("../../configs/db");

const findMemFeePayments = async (userId) => {
  try {
    const foundMemFeePayments = await MemFeePayment.findAll({
      attributes: ['id', 'amount'],
      include: {
        model: Payment,
        where: {
          UserId: userId
        }
      }
      
    });
    // console.log("foundMemFeePayments: ", foundMemFeePayments);
    return foundMemFeePayments.map (row => row.dataValues)
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = findMemFeePayments;