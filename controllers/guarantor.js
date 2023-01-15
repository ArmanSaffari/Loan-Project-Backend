const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck")
const findLoanById = require("../services/loan/findLoansById");
const allowableGuarantee = require("../services/guarantor/allowableGuarantee");
const addGuarantor = require("../services/guarantor/addGuarantor");
const findGuarantorRequestByUserId = require("../services/guarantor/findGuarantorRequestByUserId");
const confirmByGaurantor = require("../services/guarantor/confirmByGaurantor");
const getWaitingRequests = require("../services/guarantor/getWaitingRequests");
const confirmByAdmin = require("../services/guarantor/confirmByAdmin");

const declareGuarantor = async (req, res) => {
  const error = { message: "The loan id is not valid" };
  let message = [];
  try {
    const foundLoan = await findLoanById(req.body.loanId);
    if (foundLoan) {
      for (let guarantor of req.body.guarantorId) {
        let allowableGuaranteeAmount = await allowableGuarantee(guarantor);
        if (allowableGuaranteeAmount === null) {
          message.push("Provided data is not valid!")
        } else if (allowableGuaranteeAmount > foundLoan.loanAmount) {
          addGuarantor({
            LoanId: req.body.loanId,
            UserId: guarantor
          })
          message.push(`Guarantor with user id of ${guarantor} added to loan number ${req.body.loanId}.`)
        } else {
          message.push(`User with id of ${guarantor} is not allowed to be a guarantor at the moment.`)
        }
      }
      res.status(200).json({
        sucess: true,
        message: message
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

const getGaurantorRequest = async (req, res) => {
  // user will receive list of guarantee requests for him/her
  try {
    const foundRecords = await findGuarantorRequestByUserId(req.userId)
    res.status(200).json({
      sucess: true,
      foundRecords: foundRecords
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const guarantorConfirmation = async (req, res) => {
  let message = [];
  try {
    for (record of req.body.records) {
      message.push(
        await confirmByGaurantor({
          userId: req.userId,
          recordId: record.loanId,
          isConfirmed: record.isConfirmed
        })
      );
    }
    res.status(200).json({
      success: true,
      message: message
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const getWaitingAdminConfirmation = async (req, res) => {
  try {
    const foundRecords = await getWaitingRequests();
    res.status(200).json({
      success: true,
      foundRecords: foundRecords
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const adminConfirmation = async (req, res) => {
  let message = [];
  try {
    for (recordId of req.body.recordId) {
      console.log("recordId: ", recordId)
      message.push( await confirmByAdmin(req.userId, recordId) );
    }
    res.status(200).json({
      success: true,
      message: message
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

router.post("/declareGuarantor", tokenCheck, declareGuarantor);
router.put("/guarantorConfirmation", tokenCheck, guarantorConfirmation);
router.get("/gurantorRequest", tokenCheck, getGaurantorRequest)
router.get("/waitingAdminConfirmation", tokenCheck, adminCheck, getWaitingAdminConfirmation)
router.put("/adminConfirmation", tokenCheck, adminCheck, adminConfirmation)

module.exports = router;