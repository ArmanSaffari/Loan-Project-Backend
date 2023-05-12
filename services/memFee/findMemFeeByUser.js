const MembershipFee = require("../../models/membershipFee");

const findMemFeeByUser = async (data) => {
  // data must include: userId
  // Optional: filter, order, limit, offset

  try {
    const filter = data.filter || {};

    let options = {};
    if (data.limit) Object.assign(options, {limit: parseInt(data.limit)});
    if (data.offset) Object.assign(options, {offset: parseInt(data.offset)});
    if (data.order) Object.assign(options, {order: [[ data.order ,"DESC" ]]});

    const foundMemFees = await MembershipFee.findAll({
      attributes: [ "id", "monthlyMembershipFee", "effectiveFrom", "confirmation", "createdAt" ],
      where: {
        UserId: data.userId,
        ...filter
      },
      ...options
    });

    return (foundMemFees.length === 0) ? false : foundMemFees.map((row)=> row.dataValues)
  
  } catch (err) {
    console.log("error is: ", err)
  }
};

module.exports = findMemFeeByUser;