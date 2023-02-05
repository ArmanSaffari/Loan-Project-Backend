const MembershipFee = require("../../models/membershipFee");

const countMemFeeByUser = async (data) => {
  // data must include userId and filter
  
  try {
    const countOfMemFee = await MembershipFee.count({
      where: {
        UserId: data.userId,
        ...data.filter
      }
    });

    return countOfMemFee
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = countMemFeeByUser;
