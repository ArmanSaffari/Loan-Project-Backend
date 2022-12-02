const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");
const bcrypt = require('bcrypt');
const env = process.env;

const register = async (req, res) => {
  const receivedData = req.body;
  receivedData.password = bcrypt.hashSync(receivedData.password, 10);
  try {
    const { error } = await registerValidation(receivedData)
    if (!error) {
      await createUser(receivedData);
      res.status(201).json({ success: true });
    } else {
      res.status(422).json({ error });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

router.post("/register", register);

module.exports = router;
