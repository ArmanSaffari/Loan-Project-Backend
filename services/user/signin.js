const user = require("../../models/user");
const bcrypt = require('bcrypt');

const checkUser = async (data) => {
    try {
        const foundUser = await user.findOne({
            where: {emailAddress: data.emailAddress}
            }
        );
        const verification = bcrypt.compareSync(data.password, foundUser.dataValues.password)
        if (verification) {
            delete foundUser.dataValues.password;
            return {verifiedUser: foundUser.dataValues}
        } else {
            return {error: "password is not correct"}
        }
         
    } catch (error) {
        return {error: "email address not found"}
    }
};

  module.exports = checkUser;