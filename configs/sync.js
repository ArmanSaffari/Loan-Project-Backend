const sequelize = require("./db");
const User = require("../models/user");
const Account = require("../models/account");
const Loan = require("../models/loan");
const MembershipFee = require("../models/membershipFee");

const syncTables = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = syncTables;
