const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const findMemFee = require("../services/memFee/findMemFee")
const addMemFee = require("../services/memFee/addMemFee");
const waitingMemFee = require("../services/memFee/waitingMemFee");
const adminCheck = require("../middlewares/adminCheck");
const updateMemFee = require("../services/memFee/updateMemFee");
const getLastMemFee = async (req, res) => {
  const error = { message: "Monthly Membership Fee has not been set yet!" }
  try {
    const memFeeList = await findMemFee(req.userId)
    if (!memFeeList) throw error
    res.status(200).json({
      success: true,
      monthlyMembershipFee: memFeeList[0].monthlyMembershipFee
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    })
  }
};

const setMemFee = async (req, res) => {
  const error = { message: "The new value is not accepted" }
  try {
    const newMemFee = req.body.monthlyMembershipFee;
    // check that is the value greater than the previous one in db
    const memFeeList = await findMemFee(req.userId)
    if (!memFeeList || newMemFee > memFeeList[0].monthlyMembershipFee ) {
      // add new record to membershipFee table
      await addMemFee({ 
        UserId: req.userId,
        monthlyMembershipFee: newMemFee
      });
      res.status(200).json({
        success: true,
        message: `membership fee increased to ${newMemFee} $`
      })
    } else {
      throw error
    }
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const getMemFeeList = async (req, res) => {
  const error = { message: "Monthly Membership Fee has not been set yet!" }
  try {
    const memFeeList = await findMemFee(req.userId)
    if (!memFeeList) throw error
    res.status(200).json({
      success: true,
      value: memFeeList
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

const getWaitingMemFee = async (req, res) => {
  const error = { message: "There is no membership fee request waiting for conformation!" }
  try{
    const waitingMemFeeList = await waitingMemFee();
    if (!waitingMemFeeList) throw error
    res.status(200).json({
      success: true,
      value: waitingMemFeeList
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

const confirmMemFee = async (req, res) => {
  try {
    const error = { message: "please specify id of membership fee records to be confirmed" }
    const memFeeRecords = req.body.membershipFeeIdList;
    let result = [];
    await memFeeRecords.map (id => updateMemFee(id));
    await res.status(200).json({
      success: true,
      message: "done!"
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

router.post("/", tokenCheck, setMemFee);
router.get("/", tokenCheck, getLastMemFee);
router.get("/list", tokenCheck, getMemFeeList);
router.get("/waiting", tokenCheck, adminCheck, getWaitingMemFee);
router.put("/waiting", tokenCheck, adminCheck, confirmMemFee);

module.exports = router;