const Account = require("../../models/account");

const addAccount = async (data) => {
  await Account.create(data);
};

module.exports = addAccount;