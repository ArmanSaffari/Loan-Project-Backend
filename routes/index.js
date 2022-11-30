const express = require("express");
const userControl = require("../controllers/user");
const router = express.Router();

router.use("/user", userControl);
router.get("/", (req, res) => {
  res.send("this is v1");
});

module.exports = router;
