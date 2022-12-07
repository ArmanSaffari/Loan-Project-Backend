const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");
const signinValidation = require("../schema/user/signin");
const checkUniqueValues = require("../services/user/checkUnique");
const checkUser = require("../services/user/signin");
const tokenCheck = require("../middlewares/tokenCheck");
const uploadPhoto = require("../middlewares/uploadPhoto");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const env = process.env;

const register = async (req, res) => {
  const receivedData = req.body;
  receivedData.password = bcrypt.hashSync(receivedData.password, 5);
  try {
    // validate values
    await registerValidation(receivedData);
    // check being unique in db
    await checkUniqueValues(receivedData);
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
    await signinValidation(receivedData);
    // verify email and password
    const { verifiedUser } = await checkUser(receivedData);
    // create token
    const token = jwt.sign({ verifiedUser }, env.SECRET_KEY, {
      expiresIn: "1 day",
    });
    res.status(200).json({ sucess: true, token: token });
  } catch (error) {
    res.status(400).json({ sucess: false, error });
  }
};

// using Multer
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/users/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname)
      cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({ storage: storage });

router.post("/register", register);
router.post("/signin", signin);
router.get("/tokenCheck", tokenCheck);
router.post("/uploadPhoto", upload.single('myFile'), uploadPhoto)

module.exports = router;
