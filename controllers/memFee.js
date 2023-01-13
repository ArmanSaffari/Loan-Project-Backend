const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const findMemFee = require("../services/memFee/findMemFee")
const addMemFee = require("../services/memFee/addMemFee");
const waitingMemFee = require("../services/memFee/waitingMemFee");
const adminCheck = require("../middlewares/adminCheck");
const updateMemFee = require("../services/memFee/updateMemFee");
const findMemFeePayments = require("../services/memFeePayment/findMemFeePayments");
const findMemFeeById = require("../services/memFee/findMemFeeById")
const deleteMemFee = require("../services/memFee/deleteMemFee");

const getLastMemFee = async (req, res) => {
  const error = { message: "Monthly Membership Fee has not been set yet!" }
  try {
    const memFeeList = await findMemFee(req.userId);
    const confirmedMemFeeList = await memFeeList.filter(row => row.confirmation == true)
    if (!confirmedMemFeeList) throw error
    res.status(200).json({
      success: true,
      monthlyMembershipFee: confirmedMemFeeList[0].monthlyMembershipFee,
      effectiveFrom: confirmedMemFeeList[0].effectiveFrom
    });
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
        monthlyMembershipFee: newMemFee,
        effectiveFrom: req.body.effectiveFrom
      });
      res.status(200).json({
        success: true,
        message: `membership fee increased to ${newMemFee} $`
      })
    } else {
      throw error
    }
  } catch(err) {
    res.status(406).json({
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
  const error = { message: "please specify id of membership fee records to be confirmed" };
  try {
    const memFeeRecords = req.body.membershipFeeIdList;
    const confirmedBy = req.userId;
    await memFeeRecords.map (id => updateMemFee(id, confirmedBy));
    res.status(200).json({
      success: true,
      message: "done!"
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const findMyMemFeePayment = async (req, res) => {
  try {
    const foundMemFeePayments = await findMemFeePayments(req.userId);
    res.status(200).json({
      success: true,
      value: foundMemFeePayments
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const removeMemFee = async (req, res) => {
  const error = { message: "provided data is not correct!" }
  const confirmedError = { message: "Confirmed records can not be deleted by user!" }
  try {
    console.log("req.body: ", req.body)
    const memFeeId = parseInt(req.body.memFeeId);
    console.log("memFeeId: ", memFeeId)
    const foundMemFee = await findMemFeeById(memFeeId);

    if (!foundMemFee || foundMemFee.UserId != req.userId) {
      throw error
    } else if (foundMemFee.confirmation) {
      throw confirmedError
    } else {
      const result = await deleteMemFee(memFeeId);
      console.log("result: ", result)
      res.status(200).json({
        success: true,
        message: result
      })
    }
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

router.post("/", tokenCheck, setMemFee);
router.get("/", tokenCheck, getLastMemFee);
router.delete("/", tokenCheck, removeMemFee);
router.get("/list", tokenCheck, getMemFeeList);
router.get("/waiting", tokenCheck, adminCheck, getWaitingMemFee);
router.put("/waiting", tokenCheck, adminCheck, confirmMemFee);
router.put("/waiting", tokenCheck, adminCheck, confirmMemFee);
router.get("/myPaidMemFee", tokenCheck, findMyMemFeePayment);

module.exports = router;