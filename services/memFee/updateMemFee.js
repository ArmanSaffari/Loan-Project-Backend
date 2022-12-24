const MembershipFee = require("../../models/membershipFee")

const updateMemFee = async (memFeeId) => {
  let response = false;
  try {
    const foundMemFee = await MembershipFee.findOne({
      where: {
        id: memFeeId
      }
    })
    if (foundMemFee === null) {
      console.log("nothing found")
      response = "a";
    } else {
      await foundMemFee.update({confirmation: true})
      response = "b";
    }
    return response
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = updateMemFee;