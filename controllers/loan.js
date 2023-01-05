const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck")
const evaluateLoanEligiblity = require("../services/loan/evaluateLoanEligibility");
const addLoan = require("../services/loan/addLoan");
const findLoanByStatus = require("../services/loan/findLoansByStatus");
const findLoanById = require("../services/loan/findLoansById");
const checkGarantor = require("../services/guarantor/allowableGuarantee");

const loanEligiblity = async (req, res) => {
  // evaluate loan eligibility:
  try {
    const evaluation = await evaluateLoanEligiblity({
      userId: req.userId,
      membershipDate: req.userData.membershipDate
    });
    res.status(200).json({
      success: true,
      evaluation: evaluation
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    })
  }
};

const addLoanRequest = async (req, res) => {
  const error = { massage: "you are not eligible for neither normal nor urgent loan!"}
  const loanType = req.body.loanType;
  let loanAmount = 0;
  try {
    const evaluation = await evaluateLoanEligiblity({
      userId: req.userId,
      membershipDate: req.userData.membershipDate
    });
    console.log("evaluation: ", evaluation)
    // check whether the request is for normal loan or urgent loan
    if (loanType == "normal" && evaluation.normal.eligibility === true) {
      loanAmount = Math.min(req.body.loanAmount , evaluation.normal.amount);
      await addLoan({
        UserId: req.userId,
        loanAmount: loanAmount,
        loanType: loanType,
        loanStatus: "requested",
        installmentNo: (req.body.installmentNo) ? req.body.installmentNo : null,
        installmentAmount: (req.body.installmentNo) ? (loanAmount / req.body.installmentNo).toFixed(2) : null
      });
    } else if (loanType == "urgent" && evaluation.urgent.eligibility === true) {
      loanAmount = Math.min(req.body.loanAmount , evaluation.urgent.amount);
      await addLoan({
        UserId: req.userId,
        loanAmount: loanAmount,
        loanType: loanType,
        loanStatus: "requested",
        installmentNo: (req.body.installmentNo) ? req.body.installmentNo : null,
        installmentAmount: (req.body.installmentNo) ? (loanAmount / req.body.installmentNo).toFixed(2) : null
      });
    } else {
      throw error
    }
    res.status(200).json({
      success: true,
      message: `${loanType} laon with the amount of ${loanAmount} has been requested!`
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

const findRequestedLoans = async (req, res) => {
  try {
    const foundLoans = await findLoanByStatus("requested");
    if (foundLoans.length > 0) {
      res.status(200).json({
        sucess: true,
        message: `${foundLoans.length} loan(s) requests found!`,
        value: foundLoans
      });
    } else {
      res.status(200).json({
        sucess: true,
        message: "There is no request pending confirmation!",
        value: []
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

const findWaitingLoans = async (req, res) => {
  try {
    const foundLoans = await findLoanByStatus("waitlisted");
    if (foundLoans.length > 0) {
      res.status(200).json({
        sucess: true,
        message: `${foundLoans.length} waitlisted loan(s) found!`,
        value: foundLoans
      });
    } else {
      res.status(200).json({
        sucess: true,
        message: "There is no waitlisted loan!",
        value: []
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}

router.get("/eligibility", tokenCheck, loanEligiblity);
router.post("/request", tokenCheck, addLoanRequest);
router.get("/requestedLoans", tokenCheck, adminCheck, findRequestedLoans);
router.get("/waitlistedLoans", tokenCheck, adminCheck, findWaitingLoans);

module.exports = router;