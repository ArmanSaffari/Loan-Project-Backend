const User = require("../models/user");
const Account = require("../models/account");
const Loan = require("../models/loan");
const MembershipFee = require("../models/membershipFee");
const Payment = require("../models/payment");
const MembershipPayment = require("../models/membershipPayment");
const Installment = require("../models/installment");

const syncTables = async () => {
  await User.sync({ alter: true });
  await Account.sync({ alter: true });
  await Loan.sync({ alter: true });
  await MembershipFee.sync({ alter: true });
  await Payment.sync({alter: true});
  await MembershipPayment.sync({alter: true});
  await Installment.sync({alter: true});
};

module.exports = syncTables;
