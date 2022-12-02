const user = require("../../models/user");
const { Op } = require("sequelize");

const checkUniqueValues = async (data) => {
    const existingData = await user.findOne({
        where: {
            [Op.or]: [
                {emailAddress: data.emailAddress},
                {phoneNumber: data.phoneNumber},
                {nationalCode: data.nationalCode}
            ]
        }
    });
    if (!existingData) {
        return false
    } else if (existingData.dataValues.emailAddress === data.emailAddress) {
        return {message: "the email already registered"}
    } else if (existingData.dataValues.phoneNumber === data.phoneNumber) {
        return {message: "the phone number already registered"}
    } else if (existingData.dataValues.nationalCode === data.nationalCode) {
        return {message: "the national code already registered"}
    }
  };
  
  module.exports = checkUniqueValues
;
  