const loan = require("../../models/loan");

const addLoan = async (data) => {
  const newLoan = await loan.create(data);
  return newLoan.dataValues
};

module.exports = addLoan;