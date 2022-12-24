const express = require("express");
const userControl = require("../controllers/user");
const memFeeControl = require("../controllers/memFee")
const router = express.Router();

router.use("/user", userControl);
router.use("/memFee", memFeeControl)
router.get("/", (req, res) => {
  res.send("this is v1");
});

module.exports = router;
