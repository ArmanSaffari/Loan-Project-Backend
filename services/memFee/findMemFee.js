const MembershipFee = require("../../models/membershipFee");

const findMemFee = async (userId) => {
  try {
    const foundMemFees = await MembershipFee.findAll({
      attribute: [ "createdAt", "monthlyMembershipFee", "confirmation"],
      order: [["createdAt", "DESC"]],
      where: {
        UserId: userId
      }
    });
    return (foundMemFees.length === 0) ? false : foundMemFees.map((row)=> row.dataValues)
  } catch (err) {
    console.log("error is: ", err)
  }
};

module.exports = findMemFee;