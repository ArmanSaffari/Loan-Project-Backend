const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");
const checkUniqueValues = require("../services/user/checkUnique");
const checkUser = require("../services/user/signin");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const env = process.env;

const register = async (req, res) => {
  const receivedData = req.body;
  receivedData.password = bcrypt.hashSync(receivedData.password, 5);
  try {
    // validate values
    const { error } = await registerValidation(receivedData);
    if (error) {
      throw error;
    }
    // check being unique in db
    const isExist = await checkUniqueValues(receivedData);
    if (isExist) {
      throw isExist;
    }
    //create user
    await createUser(receivedData);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(422).json({ error });
  }
};

const signin = async (req, res) => {
  const receivedData = req.body;
  try {
    // verify email and password
    const { verifiedUser } = await checkUser(receivedData);
    // if (error) {throw error}
    // create token
    const token = jwt.sign({ verifiedUser }, env.SECRET_KEY, {
      expiresIn: "1 day",
    });
    res.status(200).json({ sucess: true, token: token });
  } catch (error) {
    res.status(400).json({ sucess: false, error });
  }
};

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

router.post("/register", register);
router.post("/signin", signin);
router.get("/tokenCheck", tokenCheck);

module.exports = router;
