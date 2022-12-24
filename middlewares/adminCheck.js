var jwt = require("jsonwebtoken");
const env = process.env;

const adminCheck = (req, res, next) => {
  if (req.isAdmin === false) {
    res.status(401).json({
      success: false,
      message: "This action is only authorized by admin account!"
    })
  } else {
    next();
  }
}

module.exports = adminCheck;