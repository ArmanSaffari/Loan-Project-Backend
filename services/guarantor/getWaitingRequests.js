const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const User = require("../../models/user");

const getWaitingRequests = async () => {
  const foundRecords = await Guarantor.findAll({
    include: [{
      model: Loan,
      attributes: ["id", "loanAmount", "installmentNo", "installmentAmount"]
    },{
      model: User,
      attributes: ["id", "firstName", "lastName","phoneNumber"]
    }],
    attributes: [["id", "recordId"], "guarantorConfirmation", "adminConfirmation", "adminId"],
    where: {
      adminConfirmation: false
    }
  });
  return foundRecords.map(row => row.dataValues);
};

module.exports = getWaitingRequests;