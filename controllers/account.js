const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck");
const addAccount = require("../services/account/addAccount");
const findAccountByName = require("../services/account/findAccountByName");
const findAccountByNumber = require("../services/account/findAccountByNumber");

const newAccount = async (req, res) => {
  const nameError = { message: "An account with same name already exist"}
  const numberError = { message: "An account with same number already exist"}

  try {
    //check whether the account name is unique or not
    const foundAccountByName = await findAccountByName(req.body.accountName)
    if (foundAccountByName) throw nameError

    //check whether the account number is unique or not
    const foundAccountByNumber = await findAccountByNumber(req.body.accountNumber)
    if (foundAccountByNumber) throw numberError
    await addAccount(req.body);
    res.status(200).json({
      success: true,
      message: "New account added to accounts' list" 
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error 
    });
  }
};

router.post("/new", tokenCheck, adminCheck, newAccount);

module.exports = router;