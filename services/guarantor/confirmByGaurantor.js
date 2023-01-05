const Guarantor = require("../../models/guarantor")

const confirmByGuarantor = async (userId, recordId) => {
  try {
    const foundRecord = await Guarantor.findOne({
      where: {
        id: recordId
      }
    });
    if (!foundRecord || foundRecord.dataValues.UserId != userId) {
      return "Provided data is not correct"
    } else if (foundRecord.dataValues.guarantorConfirmation === true) {
      return "Given record is already confirmed!"
    } else {
      await foundRecord.update({
        guarantorConfirmation: true
      })
      return "Given record has been successfully confirmed!"
    }
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = confirmByGuarantor;