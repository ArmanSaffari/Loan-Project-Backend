const Loan = require("../../models/loan");

const updateLoan = async (data) => {
  // data must include loanId, and other updating fields
  const loanId = data.loanId;
  try {
    const foundLoan = await Loan.findOne({
      where: {
        id: loanId
      }
    });
    let updateData = data;
    delete updateData.loanId;
    updateData.comment = 
      ((foundLoan.comment) ? foundLoan.comment : "") +
      ((foundLoan.comment && data.comment) ? " // " : "") +
      ((data.comment) ? data.comment: "");
      
    await foundLoan.update(updateData)

    return { message: 
      `Loan id of ${loanId} has been updated to ${(data.loanStatus) ? data.loanStatus : foundLoan.loanStatus }${(foundLoan.loanPaymentDate) ? 
      (" for payment on " + foundLoan.loanPaymentDate) : "."}`
    }
    
  } catch (err) {
    console.log('error is: ', err)
    return err
  }
};

module.exports = updateLoan;

