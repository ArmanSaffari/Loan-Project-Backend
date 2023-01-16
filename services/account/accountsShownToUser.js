const Account = require("../../models/account");
const sequelize = require("../../configs/db");

const accountsShownToUser = async () => {
  try {
    const foundAccounts = await Account.findAll({
      where: {
        showToUsers: true
      }
    });

    return (foundAccounts)? foundAccounts.map( row => row.dataValues ) : null
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = accountsShownToUser;