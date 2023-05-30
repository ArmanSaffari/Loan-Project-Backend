const Account = require("../../models/account");
const sequelize = require("../../configs/db");

const findAccountByNumber = async (accountNumber) => {
  try {
    const foundAccount = await Account.findOne({
      where: {
        accountNumber: accountNumber
      }
    });
    return (foundAccount)? foundAccount.dataValues : null
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findAccountByNumber;