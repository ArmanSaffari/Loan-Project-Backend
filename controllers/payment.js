const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck");
const adminCheck = require("../middlewares/adminCheck");
const addPaymentService = require("../services/payment/addPayment");
const waitingPayment = require("../services/payment/waitingPayment");
const updatePayment = require("../services/payment/updatePayment");

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
  const error = "please specify id of payments to be confirmed!";
  try {
    const paymentRecords = req.body.paymentList;
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

router.post("/add", tokenCheck, addPayment);
router.get("/waiting", tokenCheck, adminCheck, getWaitingPayment);
router.put("/waiting", tokenCheck, adminCheck, confirmPayment)

module.exports = router;