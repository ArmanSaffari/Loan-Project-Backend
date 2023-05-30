const user = require("../../models/user");

const findEmploymentStatus = async (userId) => {
  const foundUser = await user.findOne({
    attributes: ["employmentStatus"],
    where: {
      id: userId
    }
  });
  return (foundUser) ? foundUser.dataValues.employmentStatus : null
};

module.exports = findEmploymentStatus;
