const user = require("../../models/user");

const findUser = async (userId) => {
  const foundUser = await user.findOne({
    where: {
      id: userId
    }
  });
  return (foundUser) ? foundUser.dataValues : null
};

module.exports = findUser;
