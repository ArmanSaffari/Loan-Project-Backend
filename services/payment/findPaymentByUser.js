const Payment = require("../../models/payment");

const findPaymentByUser = async (data) => {
  // data must include: userId, filter, order, limit, offset

  try {
    const foundPayments = await Payment.findAll({
      where: {
        Userid: data.userId,
        ...data.filter
      },
      order: [
        [ data.order ,"DESC" ]
      ],
      limit: parseInt(data.limit),
      offset: parseInt(data.offset)
    });
    
    return foundPayments.map( row => row.dataValues);
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = findPaymentByUser;
