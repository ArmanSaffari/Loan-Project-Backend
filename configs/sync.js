const User = require("../models/user");
const Account = require("../models/account");
const Loan = require("../models/loan");
const MembershipFee = require("../models/membershipFee");

const syncTables = async () => {
  await User.sync({ alter: true });
  await Account.sync({ alter: true });
  await Loan.sync({ alter: true });
  await MembershipFee.sync({ alter: true });
};

module.exports = syncTables;
