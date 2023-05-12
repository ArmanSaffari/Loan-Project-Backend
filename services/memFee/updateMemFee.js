const MembershipFee = require("../../models/membershipFee");
const sendMessage = require("../../services/message/sendMessage");

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
      //change isConfirmed to true:
      await foundMemFee.update({
        confirmation: true,
        confirmedAdminId: confirmedBy
      });
      // create message for the user:
      await sendMessage({
        UserId: foundMemFee.dataValues.UserId,
        title: "Your membership fee request approved!",
        date: new Date(),
        content: `Your membership fee increase/set request has been approved by the admin.`,
        priority: "info",
        link: "/membership"
      });
    }
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = updateMemFee;