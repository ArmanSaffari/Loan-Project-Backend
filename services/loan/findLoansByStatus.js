const Loan = require("../../models/loan");
const sequelize = require("../../configs/db");

const findLoansByStatus = async (loanStatus) => {
  try {
    const foundLoans = await Loan.findAll({
      where: {
        loanStatus: loanStatus
      }
    });
    return foundLoans.map(row => row.dataValues)
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findLoansByStatus;