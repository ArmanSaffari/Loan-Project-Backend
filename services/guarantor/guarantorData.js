const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const findLoansById = require("../loan/findLoansById");

const guarantorData = async (guarantorId) => {
  try {
    const foundRecords = await Guarantor.findAll({
    include:[{
      model: Loan,
      attributes: ["id","loanStatus"]
    }],
    where: {
      UserId: guarantorId
    }
  })
  if (foundRecords.length > 0) {
    let records = foundRecords.map(row => row.dataValues);
    for (let index = 0; index < records.length; index++) {
      let foundLoan = await findLoansById(records[index].LoanId);
      records[index] = {
        ...records[index],
        userId: foundLoan.UserId,
        amount: foundLoan.loanAmount,
        lastInstallmentDate: foundLoan.lastInstallmentDate
      };
    }
    return records
  } else {
    return []
  } 
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = guarantorData;