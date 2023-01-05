const loan = require("../../models/loan");

const addLoan = async (data) => {
  await loan.create(data);
};

module.exports = addLoan;