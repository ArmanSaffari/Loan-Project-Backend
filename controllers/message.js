const router = require("express").Router();

const tokenCheck = require("../middlewares/tokenCheck");
const checkMessage = require("../services/message/checkMessage");
const countTotalMessages = require("../services/message/countTotalMessages");
const countUnreadMessages = require("../services/message/countUnreadMessages");
const changeMessageToRead = require("../services/message/changeMessageToRead");

const getUnreadCount = async (req, res) => {
  try {
    const countsOfUnreadMessages = await countUnreadMessages ({
      userId: req.userId
    });

    res.status(200).json({
      success: true,
      value: countsOfUnreadMessages
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const totalCountsOfMessages = await countTotalMessages ({
      userId: req.userId
    });
    
    const offset = (req.query.page - 1) * req.query.limit;

    const foundMessages = await checkMessage ({
      userId: req.userId,
      filter: (req.query.filter) ? JSON.parse(req.query.filter) : null,
      order: (req.query.order) ? req.query.order : null,
      limit: req.query.limit,
      offset: offset
    });

    res.status(200).json({
      success: true,
      message: (foundMessages.length) ? 
        `${foundMessages.length} messages out of ${totalCountsOfMessages}.` : "Nothing found!",
      totalCount: totalCountsOfMessages,
      page: parseInt(req.query.page),
      start: offset + ((foundMessages.length) ? 1 : 0),
      end: offset + foundMessages.length,
      value: foundMessages
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const readMessage = async (req, res) => {
  try {
    console.log(req.body)
    const result = await changeMessageToRead ({
      userId: req.userId,
      messageId: req.body.messageId
    });
// throw "here!"
    res.status(200).json({
      success: true,
      result
    })

  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

router.get("/", tokenCheck, getMessages);
router.get("/unread", tokenCheck, getUnreadCount);
router.put("/", tokenCheck, readMessage);

module.exports = router;