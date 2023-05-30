const MemFeePayment = require("../../models/membershipPayment");
const Payment = require("../../models/payment");

const sequelize = require("../../configs/db");

const findMemFeePayments = async (data) => {
  // data must include: userId, filter, order, limit, offset

  try {
    const filter = data.filter || {};

    let options = {};
    if (data.limit) Object.assign(options, {limit: parseInt(data.limit)});
    if (data.offset) Object.assign(options, {offset: parseInt(data.offset)});
    if (data.order) Object.assign(options, {order: [[ data.order ,"DESC" ]]});

    const foundMemFeePayments = await MemFeePayment.findAll({
      attributes: ['id', 'amount'],
      where: {
        ...filter
      },
      include: {
        model: Payment,
        attributes: ["id", "paymentDate", "referenceNo", "confirmation", "attachmentAddress"],
        where: {
          UserId: data.userId
        }
      },
      ...options
    });

    // console.log("foundMemFeePayments: ", foundMemFeePayments);
    return (foundMemFeePayments.length === 0) ? false : foundMemFeePayments.map (row => row.dataValues)
  } catch (err) {
    throw err
  }
};

module.exports = findMemFeePayments;