const MembershipFee = require("../../models/membershipFee");

const findMemFeeById = async (memFeeId) => {
  try {
    const foundMemFee = await MembershipFee.findByPk(memFeeId);
    console.log(foundMemFee)
    return foundMemFee
  } catch (err) {
    console.log("error is: ", err)
  }
};

module.exports = findMemFeeById;
