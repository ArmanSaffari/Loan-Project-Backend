const Guarantor = require("../../models/guarantor")

const confirmByGuarantor = async (data) => {
  // data must inclue userId, loanId, recordId, isConfirmed
  try {
    const foundRecord = await Guarantor.findOne({
      where: {
        id: data.recordId
      }
    });
    if (!foundRecord || foundRecord.dataValues.UserId != data.userId || foundRecord.dataValues.LoanId != data.loanId) {
      return "Provided data is not correct"
    } else {
      await foundRecord.update({
        guarantorConfirmation: data.isConfirmed
      })
      return `Guarantee request has been successfully ${(data.isConfirmed) ? "approved" : "rejected"}!`
    }
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = confirmByGuarantor;