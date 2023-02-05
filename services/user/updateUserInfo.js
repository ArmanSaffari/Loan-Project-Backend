const User = require("../../models/user");

const updateUserInfo = async (userId, data) => {
  // data must include updating fields
  try {
    const foundUser = await User.findOne({
      where: {
        id: userId
      }
    });
    
    // Check that the data is identical to model fields 
    const fields = Object.keys(foundUser.dataValues);
    for(let key in data) {
      if (!fields.includes(key) || key == "id") delete data[key];
    }
    updatedField = Object.keys(data);
    if (Object.keys(data).length != 0) {
      await foundUser.update(data);
      formatter = new Intl.ListFormat("en");
      return { message: `${formatter.format(updatedField)} of user with the id of ${userId} updated successfully!` }
    } else {
      return null
    }
  } catch (err) {
    throw { message: err.message}
  }
};

module.exports = updateUserInfo;

