const Guarantor = require("../../models/guarantor")

const confirmByGuarantor = async (data) => {
  // data must inclue userId, recordId, isConfirmed
  try {
    const foundRecord = await Guarantor.findOne({
      where: {
        id: data.recordId
      }
    });
    if (!foundRecord || foundRecord.dataValues.UserId != data.userId || data.isConfirmed === null) {
      return "Provided data is not correct"
    // } else if (foundRecord.dataValues.guarantorConfirmation === data.isConfirmed) {
    //   return "Given record is already confirmed!"
    } else {
      await foundRecord.update({
        guarantorConfirmation: data.isConfirmed
      })
      return `Given record has been successfully ${(data.isConfirmed) ? "approved" : "rejected"}!`
    }
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = confirmByGuarantor;