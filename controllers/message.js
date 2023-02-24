const router = require("express").Router();
const checkMessege = require("../services/message/checkMessege");
const countTotalMessages = require("../services/message/countTotalMessages");
const countUnreadMessages = require("../services/message/countUnreadMessages");
const sendMessage = require("../services/message/sendMessage");

module.exports = router;