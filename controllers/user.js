const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");
const checkUniqueValues = require("../services/user/checkUnique")
const bcrypt = require('bcrypt');
const env = process.env;

const register = async (req, res) => {
  const receivedData = req.body;
  receivedData.password = bcrypt.hashSync(receivedData.password, 10);
  try {
    const {error} = await registerValidation(receivedData);
    if (error) {throw error}

    const isExist = await checkUniqueValues(receivedData);
    if (isExist) {throw isExist}

    await createUser(receivedData);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(422).json({ error });
  }
};

router.post("/register", register);

module.exports = router;
