const user = require("../../models/user");
const { Op } = require("sequelize");

const checkUniqueValues = async (data) => {
  const existingData = await user.findOne({
    where: {
      [Op.or]: [
        { emailAddress: data.emailAddress },
        { phoneNumber: data.phoneNumber },
        { nationalCode: data.nationalCode },
        { personnelCode: data.personnelCode },
      ],
    },
  });
  if (!existingData) {
    return true;
  } else if (existingData.dataValues.emailAddress === data.emailAddress) {
    throw { message: "the email already registered" };
  } else if (existingData.dataValues.phoneNumber === data.phoneNumber) {
    throw { message: "the phone number already registered" };
  } else if (existingData.dataValues.nationalCode === data.nationalCode) {
    throw { message: "the national code already registered" };
  } else if (existingData.dataValues.personnelCode === data.personnelCode) {
    throw { message: "the personnel code already registered" };
  }
};

module.exports = checkUniqueValues;
