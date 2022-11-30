const User = require("../models/user");

const syncTables = async () => {
  await User.sync({ alter: true });
};

module.exports = syncTables;
