const User = require("../models/user");
const Account = require("../models/account");
const Loan = require("../models/loan");
const MembershipFee = require("../models/membershipFee");
const Payment = require("../models/payment");
const MembershipPayment = require("../models/membershipPayment");
const Installment = require("../models/installment");
const Guarantor = require("../models/guarantor");
const Message = require("../models/message");
const CostIncome = require("../models/costIncome");
const Parameter = require("../models/parameter");

const syncTables = async () => {
  await User.sync({ alter: true });
  await Account.sync({ alter: true });
  await Loan.sync({ alter: true });
  await MembershipFee.sync({ alter: true });
  await Payment.sync({alter: true});
  await MembershipPayment.sync({alter: true});
  await Installment.sync({alter: true});
  await Guarantor.sync({alter: true});
  await Message.sync({alter: true});
  await CostIncome.sync({alter: true});
  await Parameter.sync({alter: true});
};

module.exports = syncTables;
