const Loan = require("../../models/loan");
const Installment = require("../../models/installment");
const Payment = require("../../models/payment");

const findInstallmentsByLoan = async (loanId) => {
  try {
    const foundRecords = await Loan.findOne({
      include: [{
        model: Installment,
        attributes: ["id", "amount", "paymentId"],
        include: [{
          model: Payment,
          attributes: ["paymentDate", "referenceNo", "confirmation", "attachmentAddress"]
        }]
      }],
      where: {
        id: loanId 
      }
    })
    return foundRecords
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = findInstallmentsByLoan;