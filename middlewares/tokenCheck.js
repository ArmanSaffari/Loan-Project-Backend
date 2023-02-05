var jwt = require("jsonwebtoken");
const env = process.env;

const tokenCheck = async (req, res, next) => {
  try {
    jwt.verify(req.header("token"), env.SECRET_KEY, (err, result) => {
      if (err) {
        throw { message: "not authorized" };
      }
      const tokenData = jwt.decode(req.header("token"));
      req.userId = tokenData.verifiedUser.id;
      req.userData = tokenData.verifiedUser;
      next()
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      err
    });
  }
};

module.exports = tokenCheck;