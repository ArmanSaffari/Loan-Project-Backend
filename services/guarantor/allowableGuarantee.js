const guarantorData = require("./guarantorData");
const findLoansById = require("../loan/findLoansById");
const findEmploymentStatus = require("../user/findEmploymentStatus");

const allowableGuarantee = async (guarantorId) => {
  // this function return the amount of loan that given guarantor can guarantee beyond existing loans.
  try {
    const empStatus = await findEmploymentStatus(guarantorId);
    if (empStatus) {
      const guarantorRecords = await guarantorData(guarantorId);
      const confirmedRecords = guarantorRecords.filter(
        row => row.adminConfirmation
      )
      const countOfGuarantedLoans = guarantorRecords.length;
      const sumOfGuarantedLoans = guarantorRecords.reduce(
        (accumulator, value) => parseFloat(accumulator) + parseFloat(value.amount)
        , 0);
      
      if (empStatus == "permanent full-time" && countOfGuarantedLoans < 3) {
        return Math.max(5000 - sumOfGuarantedLoans , 0)
      } else if (empStatus != "permanent full-time" && countOfGuarantedLoans < 2) {
        return Math.max(800 - sumOfGuarantedLoans , 0)
      } else {
        return 0
      }
    } else {
      return null
    }
  } catch (err) {
    console.log('error is: ', err)
  }

};

module.exports = allowableGuarantee;