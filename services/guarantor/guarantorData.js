const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const findLoansById = require("../loan/findLoansById");

const guarantorData = async (guarantorId) => {
  // this function find all loans that a person has been guarantor for
  try {
    const foundRecords = await Guarantor.findAll({
    include:[{
      model: Loan,
      attributes: ["id", "loanStatus", "loanAmount", "installmentNo", "loanPaymentDate", "lastInstallmentDate"]
    }],
    where: {
      UserId: guarantorId
    }
  });
  return (foundRecords.length > 0) ? foundRecords.map(row => row.dataValues) : []
  // if (foundRecords.length > 0) {
  //   let records = foundRecords.map(row => row.dataValues);
  //   for (let index = 0; index < records.length; index++) {
  //     let foundLoan = await findLoansById(records[index].LoanId);
  //     records[index] = {
  //       ...records[index],
  //       userId: foundLoan.UserId,
  //       amount: foundLoan.loanAmount,
  //       lastInstallmentDate: foundLoan.lastInstallmentDate
  //     };
  //   }
  //   return records
  // } else {
  //   return []
  // } 
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = guarantorData;