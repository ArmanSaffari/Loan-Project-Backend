const express = require("express");
const userControl = require("../controllers/user");
const memFeeControl = require("../controllers/memFee");
const payControl = require("../controllers/payment");
const loanControl = require("../controllers/loan");
const accountControl = require("../controllers/account");
const guarantorControl = require("../controllers/guarantor");

const router = express.Router();

router.use("/user", userControl);
router.use("/memFee", memFeeControl);
router.use("/payment", payControl);
router.use("/loan", loanControl);
router.use("/account", accountControl);
router.use("/guarantor", guarantorControl);

router.get("/", (req, res) => {
  res.send("this is v1");
});

module.exports = router;
