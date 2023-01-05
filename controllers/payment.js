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
const addMemFeePayment = require("../services/memFeePayment/addMemFeePayment");
const addInstallment = require("../services/installment/addInstallment")
const getPaymentData = require("../services/payment/getPaymentData");

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
  const confirmedBy = req.userId;
  try {
    let response = [];
    // loop over payments that are going to be confirmed and assigned!
    for (let index = 0; index < req.body.paymentList.length; index++) {
      let payment = req.body.paymentList[index];
      let foundPayment = await findPayment(payment.id);
      payment.amount = foundPayment.amount;
      // console.log("foundPayment: ", foundPayment);
      // check the username in req body matches the payment id
      if (foundPayment.UserId != payment.UserId) {
        payment.message = "The user id does not match the information of the payment!";
      } else if (foundPayment.confirmation == true) {
      // check whether the payment is already confirmed
        payment.message = "The payment is already confirmed!";
      } else {
        // gather payments history up to now:
        let userData = await getPaymentData({
          userId: payment.UserId,
          membershipDate: req.userData.membershipDate
        }); 
        console.log("userData : ", userData)
        
        // // assign payment pased on userDate:
        let remainedAmount = payment.amount;
        let processingAmount = 0;
        payment.addedRecords = [];

        // (1) pay unpaid memFees
        if (userData.memFeeRemained > 0) {
          processingAmount = (userData.memFeeRemained < remainedAmount) ?
            userData.memFeeRemained : remainedAmount;
          await addMemFeePayment({
            PaymentId: payment.id,
            amount: processingAmount
          })
          remainedAmount = parseFloat(remainedAmount) - parseFloat(processingAmount);
          payment.addedRecords.push({
            table: "membershipPayments",
            amount: parseFloat(processingAmount)
          });
        }

        // (2) pay unpaid installments
        for (let instIndex = 0; instIndex < userData.numberOfActiveLoans; instIndex++) {
          let instRecord = userData.installments[instIndex];
          // console.log("instRecord: ", instRecord);
          let toBePaid = instRecord.installmentAmountToBePaid - instRecord.sum;
          // console.log("toBePaid: ",toBePaid)
          if (remainedAmount > 0 && toBePaid > 0) {
            processingAmount = (toBePaid < remainedAmount) ? toBePaid : remainedAmount;
            await addInstallment ({
              PaymentId: payment.id,
              LoanId: instRecord.loanId,
              amount: processingAmount
            });
            remainedAmount = parseFloat(remainedAmount) - parseFloat(processingAmount);
            payment.addedRecords.push({
              table: "Installments",
              amount: parseFloat(processingAmount)
            });
            // console.log("payment2: ", payment)
          }
        }
        // (3) if extra
        // (3-1) add aditional membershipFee
        console.log("extra remained!! / remainedAmount: ", remainedAmount)
        while (remainedAmount > 0) {
          processingAmount = (userData.memFeeToBePaid.lastMemFee < remainedAmount) ?
          userData.memFeeToBePaid.lastMemFee : remainedAmount;
          await addMemFeePayment({
            PaymentId: payment.id,
            amount: processingAmount
          })
          remainedAmount = parseFloat(remainedAmount) - parseFloat(processingAmount);
          payment.addedRecords.push({
            table: "membershipPayments",
            amount: parseFloat(processingAmount)
          }); 
          console.log("membershipPayments added : ", processingAmount)
          for (let instIndex = 0; instIndex < userData.numberOfActiveLoans; instIndex++) {
            console.log("remainedAmount: ", remainedAmount) 
            if (remainedAmount > 0) { 
              let instRecord = userData.installments[instIndex];
              processingAmount = (instRecord.installmentAmount < remainedAmount) ?
              instRecord.installmentAmount : remainedAmount;
              await addInstallment ({
                PaymentId: payment.id,
                LoanId: instRecord.loanId,
                amount: processingAmount
              });
              remainedAmount = parseFloat(remainedAmount) - parseFloat(processingAmount);
              payment.addedRecords.push({
                table: "Installments",
                amount: parseFloat(processingAmount)
              });
              console.log("installment added : ", processingAmount)
            }
          }
        }
        console.log("outside while loop")
        if (remainedAmount == 0) {
            await updatePayment(payment.id, confirmedBy);
            payment.message = "Payment successfully assigned and confirmed!";
          } else {
            payment.message = "Something went wrong!";
          }
         
      }
      
      response[index] = payment;
      
    }
    await res.status(200).json({
      success: true,
      value: response
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