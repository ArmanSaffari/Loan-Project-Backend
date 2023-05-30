const guarantorData = require("./guarantorData");
const findLoansById = require("../loan/findLoansById");
const findEmploymentStatus = require("../user/findEmploymentStatus");
const findUser = require("../../services/user/findUser");

const allowableGuarantee = async (guarantorId) => {
  // this function return the amount of loan that given guarantor can guarantee beyond existing loans.
  try {
    // (1) find the guarantor basic information
    const guarantor = await findUser(guarantorId);
    if (!guarantor) throw new Error("Provided data is not valid!");
    
    //(2) find all loans that he/she is guarantor for
    const guarantorRecords = await guarantorData(guarantorId);
    // console.log("guarantorRecords: ", guarantorRecords)

    //(3) filter loans which are requested, waitlisted or active
    const confirmedRecords = guarantorRecords.filter(
        row => row.adminConfirmation && ["requested","waitlisted","active"].includes(row.Loan.loanStatus)
    )
    // console.log("confirmedRecords: ", confirmedRecords)
    const countOfGuarantedLoans = guarantorRecords.length;
    const sumOfGuarantedLoans = guarantorRecords.reduce(
      (accumulator, value) => parseFloat(accumulator) + parseFloat(value.Loan.loanAmount)
      , 0);
    
    // console.log("sumOfGuarantedLoans: ", sumOfGuarantedLoans)
    if (countOfGuarantedLoans <= 3) {
      return Math.max(20000 - sumOfGuarantedLoans , 0)
    } else {
      return 0
    }
  } catch (err) {
    return null
  }

};

module.exports = allowableGuarantee;