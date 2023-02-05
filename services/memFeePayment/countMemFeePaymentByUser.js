const MembershipPayment = require("../../models/membershipPayment");
const Payment = require("../../models/payment");

const countMemFeePaymentByUser = async (data) => {
  // data must include userId and filter

  try {
    const countOfMemFee = await MembershipPayment.count({
      where: {
        ...data.filter
      },
      include: {
        model: Payment,
        where: {
          UserId: data.userId
        }
      }
    });

    return countOfMemFee
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = countMemFeePaymentByUser;
