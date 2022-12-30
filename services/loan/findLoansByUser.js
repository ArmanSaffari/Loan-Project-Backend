const Loan = require("../../models/loan");
const sequelize = require("../../configs/db");

const findLoansByUser = async (userId, status) => {
  try {
    const foundLoans = await Loan.findAll({
      where: {
        UserId: userId,
        loanStatus: status
      }
    });
    return foundLoans.map(row => row.dataValues)
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findLoansByUser;