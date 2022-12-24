var jwt = require("jsonwebtoken");
const env = process.env;

const tokenCheck = async (req, res, next) => {
  try {
    jwt.verify(req.header("token"), env.SECRET_KEY, (err, result) => {
      if (err) {
        throw { error: "not authorized" };
      }
      const tokenData = jwt.decode(req.header("token"));
      req.userId = tokenData.verifiedUser.id;
      req.isAdmin = tokenData.verifiedUser.isAdmin;
      next()
    });
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = tokenCheck;