const Loan = require("../../models/loan");
const Installment = require("../../models/installment");
const Payment = require("../../models/payment");

const findInstallmentsByUser = async (userId) => {
  try {
    const foundRecords = await Loan.findAll({
      include: [{
        model: Installment,
        attributes: ["id", "amount", "paymentId"],
        include: [{
          model: Payment,
          attributes: ["paymentDate", "referenceNo", "confirmation", "attachmentAddress"]
        }]
      }],
      where: {
        UserId: userId 
      }
    })
    return foundRecords
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = findInstallmentsByUser;