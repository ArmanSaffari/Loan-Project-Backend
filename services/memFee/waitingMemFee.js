const MembershipFee = require("../../models/membershipFee");

const waitingMemFee = async () => {
  try {
    const foundMemFees = await MembershipFee.findAll({
      order: [["createdAt", "ASC"]],
      where: {
        confirmation: false
      }
    });
    return (foundMemFees.length === 0) ? false : foundMemFees.map((row)=> row.dataValues)
  } catch (err) {
    console.log("error is: ", err)
  }
};

module.exports = waitingMemFee;
