const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck");
const addPaymentService = require("../services/payment/addPayment");
const waitingPayment = require("../services/payment/waitingPayment");
const updatePayment = require("../services/payment/updatePayment");
const findPayment = require("../services/payment/findPayment");
const findInstallmentsSummary = require("../services/installment/findInstallmentsSummary");
const sumOfMemFee = require("../services/memFeePayment/sumOfMemFee");
const memFeeToBePaid = require("../services/memFeePayment/memFeeToBePaid");
const findLoansByUser = require("../services/loan/findLoansByUser");

const addPayment = async (req, res) => {
  try {
    const receivedData = {
      UserId: req.userId,
      ...req.body
    }
    await addPaymentService(receivedData);
    res.status(200).json({
      success: true,
      message: "new payment added!"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      err
    })
  }
};

const getWaitingPayment = async (req, res) => {
    const error = { message: "There is no payment record waiting for conformation!" }
  try{
    const waitingPaymentList = await waitingPayment();
    const message =
      (waitingPaymentList.length == 0) ?
      "There is no payment record waiting for conformation!" :
      `${waitingPaymentList.length} request(s) need to be confirmed.`;
    res.status(200).json({
      success: true,
      message: message,
      value: waitingPaymentList
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};


const confirmPayment = async (req, res) => {
  try {
    const paymentRecords = req.body.paymentList.map(row => row.id);
    const confirmedBy = req.userId;
    // for (paymentRecord in paymentRecords) {
    //assignPayment(x)
    // }

    await paymentRecords.map(id => updatePayment(id, confirmedBy));
    res.status(200).json({
      success: true,
      message: "done!"
    });
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
};

const paymentAssignment = async (req, res) => {
  const error = { message: "The user id does not match the information of the payment!"}
  
  try {
    let userData, message, loanPaymentDate, installmentToBePaid, installments;
    // loop over payments that are going to be confirmed and assigned!
    for (let index = 0; index < req.body.paymentList.length; index++) {
      let userData = [];
      let payment = req.body.paymentList[index];
      let foundPayment = await findPayment(payment.id);
      // console.log("foundPayment: ", foundPayment);
      // check the username in req body matches the payment id
      if (foundPayment.UserId != payment.UserId) {
        throw error
      }
      // check whether the payment is already confirmed
      if (foundPayment.confirmation == true) {
        message = "The payment is already confirmed!"
        console.log(message)
      } else {
        let currentDate = new Date();
        // (1) evaluate membership payments:

        // find how many membership fee should be paid so far
        let membershipDate = new Date(req.userData.membershipDate);
          
        userData = {
          userId: payment.UserId,
          membershipDate: membershipDate,
          memFeeToBePaid: await memFeeToBePaid(currentDate, payment.UserId),
          memFee: await sumOfMemFee(payment.UserId),
          installments: [],
          dataGateringDate: currentDate
        }

        // (2) evaluate loans
        let activeLoans = await findLoansByUser(foundPayment.UserId, 'active');
        
        if (activeLoans) {
          // userData.installments = [];
          for (let loanIndex = 0; loanIndex < activeLoans.length; loanIndex++) {
            let installmentData = await findInstallmentsSummary(activeLoans[loanIndex].id);
            
            // find how many installments should be paid so far
            loanPaymentDate = new Date(activeLoans[loanIndex].loanPaymentDate);
            installmentToBePaid = 
              currentDate.getMonth() - loanPaymentDate.getMonth() +
              12 * (currentDate.getFullYear() - loanPaymentDate.getFullYear());

            if (currentDate.getDate() < loanPaymentDate.getDate()) {
              installmentToBePaid--;
            }

            userData.installments[loanIndex] = {
              loanId: activeLoans[loanIndex].id,
              loanPaymentDate: loanPaymentDate,
              installmentToBePaid: installmentToBePaid,
              ...installmentData[0]
            };
            
          }
        }
        console.log("userData : ", userData)

        // assign payment pased on userDate:
        //

      }
    }

    await res.status(200).json({
      success: true,
      value: userData
    })
  } catch(err) {
    res.status(400).json({
      success: false,
      err
    });
  }
}


router.post("/add", tokenCheck, addPayment);
router.get("/waiting", tokenCheck, adminCheck, getWaitingPayment);
router.put("/waiting", tokenCheck, adminCheck, confirmPayment);
router.post("/paymentAssignment", tokenCheck, adminCheck, paymentAssignment);

module.exports = router;