const MemFeePayment = require("../../models/membershipPayment");
const Payment = require("../../models/payment");

const sequelize = require("../../configs/db");

const findMemFeePayments = async (data) => {
  // data must include: userId, filter, order, limit, offset

  try {
    const foundMemFeePayments = await MemFeePayment.findAll({
      attributes: ['id', 'amount'],
      where: {
        ...data.filter
      },
      order: [
        [ data.order ,"DESC" ]
      ],
      include: {
        model: Payment,
        attributes: ["id", "paymentDate", "referenceNo", "confirmation", "attachmentAddress"],
        where: {
          UserId: data.userId
        }
      },
      limit: parseInt(data.limit),
      offset: parseInt(data.offset)
      
    });
    // console.log("foundMemFeePayments: ", foundMemFeePayments);
    return (foundMemFeePayments.length === 0) ? false : foundMemFeePayments.map (row => row.dataValues)
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = findMemFeePayments;