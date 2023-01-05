const Account = require("../../models/account");
const sequelize = require("../../configs/db");

const findAccountByNumber = async (accountNumber) => {
  try {
    const foundLoan = await Account.findOne({
      where: {
        accountNumber: accountNumber
      }
    });
    return (foundLoan)? foundLoan.dataValues : null
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findAccountByNumber;