const user = require("../../models/user");
const bcrypt = require("bcrypt");

const checkUser = async (data) => {
  const error = "email address or password is not correct";
  try {
    const foundUser = await user.findOne({
      where: { emailAddress: data.emailAddress },
    });
    const verification = bcrypt.compareSync(
      data.password,
      foundUser.dataValues.password
    );
    if (verification) {
      delete foundUser.dataValues.password;
      return { verifiedUser: foundUser.dataValues };
    } else {
      throw error;
    }
  } catch (err) {
    console.error(err);
    throw error;
  }
};

module.exports = checkUser;
