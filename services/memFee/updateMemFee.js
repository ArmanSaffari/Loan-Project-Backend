const MembershipFee = require("../../models/membershipFee")

const updateMemFee = async (memFeeId, confirmedBy) => {
  try {
    const foundMemFee = await MembershipFee.findOne({
      where: {
        id: memFeeId
      }
    });
    if (foundMemFee === null) {
      console.log("nothing found")
    } else {
      await foundMemFee.update({
        confirmation: true,
        confirmedAdminId: confirmedBy
      });
    }
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = updateMemFee;