const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck")
const evaluateLoanEligiblity = require("../services/loan/evaluateLoanEligibility");
const addLoan = require("../services/loan/addLoan");
const findLoanByStatus = require("../services/loan/findLoansByStatus");
const findLoanById = require("../services/loan/findLoansById");
const findLoanByUser = require("../services/loan/findLoansByUser")
const updateLoan = require("../services/loan/updateLoan");
const addCostIncome = require("../services/costIncome/addCostIncome");
const findInstallmentsSummary = require("../services/installment/findInstallmentsSummary");
const findInstallmentsByUser = require("../services/installment/findInstallmentsByUser");
const findInstallmentsByLoan = require("../services/installment/findInstallmentsByLoan");
const getPaymentData = require("../services/payment/getPaymentData");

const findMyLoans = async (req, res) => {
  // return all loans belongs to the requested user:
  try {
    let foundLoans = await findLoanByUser(req.userId);
    for (let index = 0; index < foundLoans.length; index++) {
      let summary = await findInstallmentsSummary(foundLoans[index].id);
      foundLoans[index].installmentSumary = summary[0];
    }
    res.status(200).json({
      sucess: true,
      message: (foundLoans.length) ? 
        `${foundLoans.length} loan(s) found.` : "There is not any loan for given user id",
      value: foundLoans
      })

  } catch(err) {
    res.status(400).json({
      success: false,
      err
    })
  }
};

const findMyInstallments = async (req, res) => {
  try {
    const foundInstallments = await findInstallmentsByLoan(req.body.loanId);
    // console.log(foundInstallments)
    res.status(200).json({
      success: true,
      value: (foundInstallments.UserId == req.userId) ?
        foundInstallments : []
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
};

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
  const error = { massage: `you are not eligible for ${req.body.loanType} loan!`}
  let loanAmount = 0;
  try {
    const evaluation = await evaluateLoanEligiblity({
      userId: req.userId,
      membershipDate: req.userData.membershipDate
    });
    console.log("evaluation: ", evaluation);
    if (evaluation[req.body.loanType].eligibility) {
      loanAmount = Math.min(req.body.loanAmount , evaluation[req.body.loanType].amount);
      const installmentNo = Math.min(req.body.installmentNo, 24) // max allowed installment No is 24
      await addLoan({
        UserId: req.userId,
        loanAmount: loanAmount,
        loanType: req.body.loanType,
        loanStatus: "requested",
        installmentNo: installmentNo, 
        installmentAmount: (loanAmount / installmentNo).toFixed(2)
      });
    } else {
      throw error
    }
    res.status(200).json({
      success: true,
      message: `${req.body.loanType} loan with the amount of ${loanAmount} has been requested!`
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const cancelLoanRequest = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in requested status!"}
  try {
    // (1) check given data
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan && foundLoan.loanStatus == "requested") {
      // (2) change loanStatus to "rejected"
      const result = await updateLoan({
        loanId: req.body.loanId,
        loanStatus: "canceled"
      });
      res.status(200).json({
        sucess: true,
        ...result,
      });
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

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
};

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
};

const confirmLoan = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in requested status!"}
  try {
    // (1) calculate administerationFee
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan && foundLoan.loanStatus == "requested") {
      let administerationFee = (foundLoan.loanAmount * 0.02).toFixed(2);
      // (2) adjust administerationFee in order to reach total balance (round of installmentAmount)
      administerationFee = (
        parseFloat(administerationFee) +
        parseFloat((foundLoan.loanAmount) -
        (foundLoan.installmentNo * foundLoan.installmentAmount))
      ).toFixed(2);
      // (3) update loan Record
      const result = await updateLoan({
        loanId: req.body.loanId,
        loanStatus: "waitlisted",
        administerationFee: administerationFee,
        loanPaymentDate: req.body.loanPaymentDate,
        lastInstallmentDate: req.body.loanPaymentDate,
        comment: req.body.comment
      });
      res.status(200).json({
        sucess: true,
        ...result,
        administerationFee: administerationFee
      });
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const changeLoanDate = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in requested status!"}
  try {
    // (1) check given data
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan) {
      // (2) change loan Payment Date
      const result = await updateLoan({
        loanId: req.body.loanId,
        loanPaymentDate: req.body.loanPaymentDate,
        comment: req.body.comment
      });
      res.status(200).json({
        sucess: true,
        ...result,
      });
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const activateLoan = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in waitlisted status!"}
  try {
    // (1) check given data
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan && foundLoan.loanStatus == "waitlisted") {
      // (2) change loanStatus to "active"
      const result = await updateLoan({
        loanId: req.body.loanId,
        loanStatus: "active",
        chequeNo: req.body.chequeNo,
        comment: req.body.comment
      });
      // (3) add administerationFee to costIncome table
      await addCostIncome({
        isIncome: true,
        title: `Administration fee ( Loan id of ${req.body.loanId} )`,
        category: 'administeration fee',
        date: foundLoan.loanPaymentDate,
        amount: foundLoan.administerationFee,
        accountId: req.body.accountId,
        AdminId: req.userId
      });
      res.status(200).json({
        sucess: true,
        ...result,
        addedRecords: {
          table: "CostIncome",
          amount: foundLoan.administerationFee
        }
      });
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const rejectLoan = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in requested status!"}
  try {
    // (1) check given data
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan && foundLoan.loanStatus == "requested") {
      // (2) change loanStatus to "rejected"
      const result = await updateLoan({
        loanId: req.body.loanId,
        loanStatus: "rejected",
        comment: req.body.comment
      });
      res.status(200).json({
        sucess: true,
        ...result,
      });
    } else {
      throw error
    }
    
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const terminateLoan = async (req, res) => {
  const error = { massage: "Given loan id does not exist or is not in active status!"}
  try {
    // (1) check given data
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan && foundLoan.loanStatus == "active") {
      // (2) check all installments are payed or not
      const installmentSummary = await findInstallmentsSummary(req.body.loanId);
      console.log("installmentSummary", installmentSummary)
      const payOffAmount = (foundLoan.installmentAmount * foundLoan.installmentNo).toFixed(2)
      console.log("payOffAmount", payOffAmount)
      if ((parseFloat(installmentSummary[0].sum)).toFixed(2) === payOffAmount) {
        
        console.log("here")
        const result = await updateLoan({
          loanId: req.body.loanId,
          loanStatus: "terminated",
          comment: req.body.comment
        });
        console.log(result)
        res.status(200).json({
          sucess: true,
          ...result
        });
      } else {
        throw { message: "Payments must be completed before terminating a loan."}
      }
    } else {
      throw error
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

router.get("/myLoans", tokenCheck, findMyLoans);
router.get("/myInstallments", tokenCheck, findMyInstallments);
router.get("/eligibility", tokenCheck, loanEligiblity);
router.post("/request", tokenCheck, addLoanRequest);
router.post("/cancelRequest", tokenCheck, cancelLoanRequest);
router.get("/requestedLoans", tokenCheck, adminCheck, findRequestedLoans);
router.put("/confirm", tokenCheck, adminCheck, confirmLoan);
router.put("/changeDate", tokenCheck, adminCheck, changeLoanDate);
router.get("/waitlistedLoans", tokenCheck, adminCheck, findWaitingLoans);
router.put("/activate", tokenCheck, adminCheck, activateLoan);
router.put("/reject", tokenCheck, adminCheck, rejectLoan);
router.get("/activeLoans", tokenCheck, adminCheck, findWaitingLoans);
router.put("/terminate", tokenCheck, adminCheck, terminateLoan);

module.exports = router;