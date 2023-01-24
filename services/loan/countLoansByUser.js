const Loan = require("../../models/loan");

const countLoansByUser = async (data) => {
  try {
    const countOfPayments = await Loan.count({
      where: {
        UserId: data.userId,
        ...data.filter
      }
    });

    return countOfPayments
    
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = countLoansByUser;
