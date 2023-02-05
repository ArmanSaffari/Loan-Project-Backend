const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const findMemFeeByUser = require("../services/memFee/findMemFeeByUser")
const addMemFee = require("../services/memFee/addMemFee");
const waitingMemFee = require("../services/memFee/waitingMemFee");
const adminCheck = require("../middlewares/adminCheck");
const updateMemFee = require("../services/memFee/updateMemFee");
const findMemFeePayments = require("../services/memFeePayment/findMemFeePayments");
const findMemFeeById = require("../services/memFee/findMemFeeById")
const deleteMemFee = require("../services/memFee/deleteMemFee");
const countMemFeeByUser = require("../services/memFee/countMemFeeByUser");
const countMemFeePaymentByUser = require("../services/memFeePayment/countMemFeePaymentByUser");

const getLastMemFee = async (req, res) => {
  const error = { message: "Monthly Membership Fee has not been set yet!" }
  try {
    const memFeeList = await findMemFeeByUser({
      userId: req.userId,
    });
    const confirmedMemFeeList = await memFeeList.filter(row => row.confirmation == true)
    if (!confirmedMemFeeList) throw error
    res.status(200).json({
      success: true,
      monthlyMembershipFee: confirmedMemFeeList[0].monthlyMembershipFee,
      effectiveFrom: confirmedMemFeeList[0].effectiveFrom,
      waitingMemFeeExist: (confirmedMemFeeList.length == memFeeList.length) ?
        false : true
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
    res.status(400).json({
      success: false,
      err
    });
  }
};

const getMemFeeList = async (req, res) => {
  const error = { message: "Monthly Membership Fee has not been set yet!" }
  try {
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};

    const totalCountsOfMemFee = await countMemFeeByUser({
      userId: req.userId,
      filter
    });

    if (totalCountsOfMemFee == 0) throw error

    const offset = (req.query.page - 1) * req.query.limit;
    
    const memFeeList = await findMemFeeByUser({
      userId: req.userId,
      filter,
      order: (req.query.order) ? req.query.order : "createdAt",
      limit: req.query.limit,
      offset: offset
    });

    res.status(200).json({
      success: true,
      message: (memFeeList.length) ? 
        `${memFeeList.length} payments out of ${totalCountsOfMemFee}.` : "Nothing found!",
      totalCount: totalCountsOfMemFee,
      page: parseInt(req.query.page),
      start: offset + ((memFeeList.length) ? 1 : 0),
      end: offset + memFeeList.length,
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
  const error = { message: "Nothing Found!" }

  try {
    const filter = (req.query.filter) ? JSON.parse(req.query.filter) : {};

    const totalCountsOfMemFeePayment = await countMemFeePaymentByUser({
      userId: req.userId,
      filter
    });

    if (totalCountsOfMemFeePayment == 0) throw error

    const offset = (req.query.page - 1) * req.query.limit;

    const foundMemFeePayments = await findMemFeePayments({
      userId: req.userId,
      filter,
      order: (req.query.order) ? req.query.order : "createdAt",
      limit: req.query.limit,
      offset: offset
    });

    res.status(200).json({
      success: true,
      message: (foundMemFeePayments.length) ? 
        `${foundMemFeePayments.length} payments out of ${totalCountsOfMemFeePayment}.` : "Nothing found!",
      totalCount: totalCountsOfMemFeePayment,
      page: parseInt(req.query.page),
      start: offset + ((foundMemFeePayments.length) ? 1 : 0),
      end: offset + foundMemFeePayments.length,
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
    const memFeeId = parseInt(req.body.recordId);
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