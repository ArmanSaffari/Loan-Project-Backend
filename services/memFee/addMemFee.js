const membershipFee = require("../../models/membershipFee");

const addMemFee = async (data) => {
  await membershipFee.create(data);
};

module.exports = addMemFee;