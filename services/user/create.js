const user = require("../../models/user");

const createUser = async (data) => {
  let newUser = await user.create(data);
  return newUser.dataValues.id;
};

module.exports = createUser;
