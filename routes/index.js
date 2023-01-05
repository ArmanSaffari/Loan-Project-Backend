const express = require("express");
const userControl = require("../controllers/user");
const memFeeControl = require("../controllers/memFee");
const payControl = require("../controllers/payment");
const loanControl = require("../controllers/loan");
const router = express.Router();

router.use("/user", userControl);
router.use("/memFee", memFeeControl);
router.use("/payment", payControl);
router.use("/loan", loanControl);
router.get("/", (req, res) => {
  res.send("this is v1");
});

module.exports = router;
