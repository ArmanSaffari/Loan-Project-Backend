const MembershipFee = require("../../models/membershipFee");

const deleteMemFee = async (memFeeId) => {
  try {
    await MembershipFee.destroy({
      where: {
        id: memFeeId
      }
    })
    return "The record deleted successfully!";
  } catch (err) {
    return err
  }
};

module.exports = deleteMemFee;