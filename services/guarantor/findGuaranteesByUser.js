const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");
const User = require("../../models/user");

const findGuaranteesByUser = async (data) => {

  try {
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
        UserId: data.userId,
        ...data.filter
      },
      order: [
        [ data.order ,"DESC" ]
      ],
      limit: parseInt(data.limit),
      offset: parseInt(data.offset)
    });

    return foundRecords.map(row => row.dataValues);
  } catch(err) {
    console.log("error is: ", err)
  }
  
};

module.exports = findGuaranteesByUser;