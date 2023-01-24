const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const User = require("../../models/user");

const findGuarantorsByLoanId = async (loanId) => {
  const foundRecords = await Guarantor.findAll({
    include: [{
      model: Loan,
      attributes: ["id", "loanAmount", "installmentNo", "installmentAmount"]
    },{
      model: User,
      attributes: ["id", "firstName", "lastName", "phoneNumber"]
    }],
    attributes: [["id", "recordId"], "guarantorConfirmation", "adminConfirmation"],
    where: {
      LoanId: loanId
    } 
  });
  return foundRecords.map(row => row.dataValues);
}

module.exports = findGuarantorsByLoanId;