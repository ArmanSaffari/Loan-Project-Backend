const Account = require("../../models/account");
const sequelize = require("../../configs/db");

const findAccountByName = async (accountName) => {
  try {
    const foundAccount = await Account.findOne({
      where: {
        accountName: accountName
      }
    });
    return (foundAccount)? foundAccount.dataValues : null
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findAccountByName;