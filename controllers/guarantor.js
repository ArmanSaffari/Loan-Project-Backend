const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck")
const findLoanById = require("../services/loan/findLoansById");
const allowableGuarantee = require("../services/guarantor/allowableGuarantee");
const addGuarantor = require("../services/guarantor/addGuarantor");
const findGuarantorRequestByUserId = require("../services/guarantor/findGuaranteesByUser");
const confirmByGaurantor = require("../services/guarantor/confirmByGaurantor");
const getWaitingRequests = require("../services/guarantor/getWaitingRequests");
const confirmByAdmin = require("../services/guarantor/confirmByAdmin");
const findUser = require("../services/user/findUser");
const findGuarantorsByLoanId = require("../services/guarantor/findGuarantorsByLoanId");
const countGuaranteesByUser = require("../services/guarantor/countGuaranteesByUser");
const findGuaranteesByUser = require("../services/guarantor/findGuaranteesByUser");
const deleteGuarantor = require("../services/guarantor/deleteGuarantor");

const newGuarantor = async (req, res) => {
  const dataError = { message: "Provided data is not valid!" };
  const loanError = { message: "The loan must be in 'requested' status."}
  const uniqueError = { message: "The guarantor is already added to this loan!"}
  let message = "";
  let success = true;
  try {

    const foundLoan = await findLoanById(req.body.loanId);

    // check found loan
    if (!foundLoan) throw dataError;
    if (req.userId != foundLoan.UserId) throw dataError
    if (foundLoan.loanStatus != "requested") throw loanError
    
    const currentGuarantors = 
      foundLoan.Guarantors.map(row => row.UserId);
    const guarantorId = parseInt(req.body.guarantorId);
    if (currentGuarantors.includes(guarantorId)) throw uniqueError 

    const foundUser = await findUser(guarantorId);
    if ((foundUser.lastName.toLowerCase()) != req.body.guarantorLastName.toLowerCase()) throw dataError;
    
    const allowableGuaranteeAmount = await allowableGuarantee(guarantorId);
    // console.log("allowableGuaranteeAmount: ", allowableGuaranteeAmount)
    if (allowableGuaranteeAmount === null) throw dataError
    
    if (allowableGuaranteeAmount > foundLoan.loanAmount) {
      addGuarantor({
        LoanId: req.body.loanId,
        UserId: guarantorId
      })
      message =  
        `Mr./ Mrs./ Ms. ${foundUser.lastName} with user id of ${guarantorId} added to loan number ${req.body.loanId}.`
    
    } else {
      message =  
        `Mr./ Mrs./ Ms. ${foundUser.lastName} with id of ${guarantorId} is not allowed to be a guarantor at the moment.`
      success = false;
      }

    res.status(200).json({
      success: success,
      message: message
    });

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
    const totalCountsOfGuarantees = await countGuaranteesByUser({
      userId: req.userId,
      filter: JSON.parse(req.query.filter)
    });

    const offset = (req.query.page - 1) * req.query.limit;

    const foundGuarantees = 
      (!totalCountsOfGuarantees) ? [] :
      await findGuaranteesByUser({
        userId: req.userId,
        filter: JSON.parse(req.query.filter),
        order: (req.query.order) ? req.query.order : "createdAt",
        limit: req.query.limit,
        offset: offset
      });

    res.status(200).json({
      success: true,
      message: (foundGuarantees.length) ? 
        `${foundGuarantees.length} guarantees out of ${totalCountsOfGuarantees}.` : "Nothing found!",
      totalCount: totalCountsOfGuarantees,
      page: parseInt(req.query.page),
      start: offset + ((foundGuarantees.length) ? 1 : 0),
      end: offset + foundGuarantees.length,
      value: foundGuarantees
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const guarantorConfirmation = async (req, res) => {
  error = { message: "confirmation can not be null"}
  try {
    if (req.body.isConfirmed === null) throw error

    const message = await confirmByGaurantor({
      userId: req.userId,
      recordId: req.body.recordId,
      loanId: req.body.loanId,
      isConfirmed: req.body.isConfirmed
    })

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

const getGuarantorList = async (req, res) => {
  try {
    const foundRecords = await findGuarantorsByLoanId(req.query.loanId);
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

const removeGuarantor = async (req, res) => {

  try {
    console.log(req.body)
    const result = await deleteGuarantor (req.userId, req.body.recordId);
      res.status(200).json({
        sucess: true,
        message: result,
      });
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

router.post("/addGuarantor", tokenCheck, newGuarantor);
router.put("/guarantorConfirmation", tokenCheck, guarantorConfirmation);
router.get("/guarantorRequest", tokenCheck, getGaurantorRequest);
router.get("/waitingAdminConfirmation", tokenCheck, adminCheck, getWaitingAdminConfirmation)
router.put("/adminConfirmation", tokenCheck, adminCheck, adminConfirmation)
router.get("/list", tokenCheck, getGuarantorList);
router.delete("/", tokenCheck, removeGuarantor);
module.exports = router;