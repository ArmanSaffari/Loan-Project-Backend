const Guarantor = require("../../models/guarantor")
const allowableGuarantee = require("../../services/guarantor/allowableGuarantee");

const confirmByAdmin = async (adminId, recordId) => {
  try {
    const foundRecord = await Guarantor.findOne({
      where: {
        id: recordId
      }
    });
    if (!foundRecord) {
      return "Provided data is not correct"
    } else if (foundRecord.dataValues.guarantorConfirmation === false) {
      return "Guarantor has not confirmed the record yet!"
    } else if (foundRecord.dataValues.adminConfirmation === true) {
      return "Given record is already confirmed by admin!"
    }else {
      const allowableGuaranteeAmount = await allowableGuarantee(foundRecord.dataValues.UserId)
      if (allowableGuaranteeAmount > 0) {
        await foundRecord.update({
          adminConfirmation: true,
          adminId: adminId
        });
        return "Given record has been successfully confirmed by admin!"
      } else {
        return "Guarantor is not eligible to guarantee this loan!"
      }
    }
  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = confirmByAdmin;