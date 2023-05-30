const Loans = require("../../models/loan");

const deleteLoan = async (LoanId) => {
  try {
    await Loans.destroy({
      where: {
        id: LoanId
      }
    })
    return "The record deleted successfully!";
  } catch (err) {
    return err
  }
};

module.exports = deleteLoan;