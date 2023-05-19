const Guarantor = require("../../models/guarantor");
const Loan = require("../../models/loan");

const deleteGuarantor = async (userId, recordId) => {
  try {
    console.log("recordId", recordId)

    const foundGuarantor = await Guarantor.findOne({
      include: [{
        model: Loan,
        attributes: ["UserId"]
      }],
      where: {
        id: recordId
      }
    });

    console.log(foundGuarantor)
    if (!foundGuarantor) {
      throw "nothing found!"
    } else if (foundGuarantor.dataValues.Loan.UserId == userId) {
      await Guarantor.destroy({
        where: {
          id: recordId
        }
      })
      return "The record deleted successfully!";
    } else {
      throw "This action is NOT authorised by this user!";
    }
    
  } catch (err) {
    return err
  }
};

module.exports = deleteGuarantor;