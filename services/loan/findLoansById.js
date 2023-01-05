const Loan = require("../../models/loan");
const sequelize = require("../../configs/db");

const findLoansById = async (loanId) => {
  try {
    const foundLoan = await Loan.findOne({
      where: {
        id: loanId
      }
    });
    return foundLoan.dataValues
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findLoansById;