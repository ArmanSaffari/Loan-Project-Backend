const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");
const signinValidation = require("../schema/user/signin");
const checkUniqueValues = require("../services/user/checkUnique");
const checkUser = require("../services/user/signin");
const tokenCheck = require("../middlewares/tokenCheck");
const getPaymentData = require("../services/payment/getPaymentData");
const updateUserInfo = require("../services/user/updateUserInfo");
const findUser = require("../services/user/findUser");

const bcrypt = require("bcrypt");
const fs = require('fs');
const { Buffer } = require('buffer');
const jwt = require("jsonwebtoken");
const env = process.env;

const registerWithPhoto = async (req, res, next) => {
  const receivedData = JSON.parse(req.body.userData);
  //Reigster
  receivedData.password = bcrypt.hashSync(receivedData.password, 5);
  try {
    // validate values
    await registerValidation(receivedData);
    // check being unique in db
    await checkUniqueValues(receivedData);
    // save user photo
    let message = "";
    if (req.file) {
      const fileBuffer = req.file.buffer;
      receivedData.userPictureAddress = "uploads/users/" + receivedData.personnelCode + path.extname(req.file.originalname);
      fs.writeFile(`./${receivedData.userPictureAddress}`, fileBuffer, async (err) => {
        if (err) {
          message = "but user photo did not uploaded successfully";
        } else {
          message = "and user photo uploaded successfully";
        }
      })
    }
    // create user
    await createUser(receivedData);
    message = `Registeration was successful ${message}.`;
    // create token
    const registeredUser = receivedData;
    delete registeredUser.password;
    const token = jwt.sign({ registeredUser }, env.SECRET_KEY, {
      expiresIn: "1 day",
    });

    res.status(200).json({ success: true,
      message: message,
      token: token });
  } catch (err) {
    
    res.status(400).json({ 
      success: false,
      err: (err.details) ?
        { message: err.details.map(row => row.message).join("; ") } :
        err
    });
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
    res.status(200).json({
      sucess: true,
      token: token,
      isAdmin: verifiedUser.isAdmin,
      message: `Hello ${verifiedUser.firstName} ${verifiedUser.lastName}!`, });
  } catch (err) {
    res.status(400).json({
      sucess: false,
      err: (err.details) ?
      { message: err.details.map(row => row.message).join("; ") } :
      err
    });
  }
};

const getUserSummary = async (req, res) => {
  try{
    let userData = await getPaymentData({
    userId: req.userId,
    membershipDate: req.userData.membershipDate
  });

  res.status(200).json({
    success: true,
    value: userData
  })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const getUserInfo = async (req, res) => {
  try{
    let data = await findUser(req.userId);

    // delete data.isAdmin, data.userPictureAddress;
    for (let key of ["password", "isAdmin", "userPictureAddress", "createdAt", "updatedAt", "deletedAt"]) {
      delete data[key];
    }
    
    res.status(200).json({
      success: true,
      value: data,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const changeUserInfo = async (req, res) => {
  const error = { message: "provided data is not correct!"};
  try {
    const result = await updateUserInfo(req.userId, req.body);
    if (result && (typeof result) != Error) {
      res.status(200).json({
        success: true,
        message: result.message
      });
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

// using Multer to upload file
const multer = require('multer');
const path = require('path');
const { join } = require("path");
const findLoansByUser = require("../services/loan/findLoansByUser");

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
const uploadMemory = multer({ storage: multer.memoryStorage() })

// router.post("/register", register);
router.post("/registerWithPhoto", uploadMemory.single('userPhoto'), registerWithPhoto)
router.post("/signin", signin);
router.get("/tokenCheck", tokenCheck, (req, res) => {res.status(200).json({ success: true })});
router.get("/summary", tokenCheck, getUserSummary);
router.get("/info", tokenCheck, getUserInfo);
router.put("/info", tokenCheck, changeUserInfo);

module.exports = router;
