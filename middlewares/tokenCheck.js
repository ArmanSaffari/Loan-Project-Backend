var jwt = require("jsonwebtoken");
const env = process.env;

const tokenCheck = async (req, res) => {
  try {
    jwt.verify(req.header("token"), env.SECRET_KEY, (err, result) => {
      if (err) {
        throw { error: "not authorized" };
      }
      res.status(200).json({ result });
    });
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports =  tokenCheck;