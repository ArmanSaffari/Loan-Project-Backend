const user = require("../../models/user");

const createUser = async (data) => {
  await user.create(data);
};

module.exports = createUser;
