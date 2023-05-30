const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const User = require("../../models/user");

const findGuarantorRequestByUserId = async (userId) => {
  const foundRecords = await Guarantor.findAll({
    include: [{
      model: Loan,
      attributes: ["id", "loanAmount", "installmentNo", "installmentAmount"]
    },{
      model: User,
      attributes: ["id", "firstName", "lastName", "phoneNumber"]
    }],
    attributes: [["id", "recordId"], "guarantorConfirmation"],
    where: {
      UserId: userId
    } 
  });
  return foundRecords.map(row => row.dataValues);
}

module.exports = findGuarantorRequestByUserId;