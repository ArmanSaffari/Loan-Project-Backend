const Loan = require("../../models/loan");
const Guarantor = require("../../models/guarantor");

const findLoansById = async (loanId) => {
  try {
    const foundLoan = await Loan.findOne({
      where: {
        id: loanId
      },
      include: {
        model: Guarantor
      }
    });
    return (foundLoan)? foundLoan.dataValues : null 
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findLoansById;