const memFeeToBePaid = require("../memFeePayment/memFeeToBePaid");
const sumOfMemFee = require("../memFeePayment/sumOfMemFee");
const findLoansByUser = require("../loan/findLoansByUser");
const findInstallmentsSummary = require("../installment/findInstallmentsSummary");

const getPaymentData = async (data) => {
  // data must include userId and membershipDate
  let extractedData = [];
  let currentDate = new Date();
  // (1) extract membership payments:

  // find how many membership fee should be paid so far
  let membershipDate = new Date(data.membershipDate);

  extractedData = {
    userId: data.userId,
    membershipDate: membershipDate,
    memFeeToBePaid: await memFeeToBePaid(currentDate, data.userId),
    memFee: await sumOfMemFee(data.userId),
    memFeeRemained: "",
    numberOfLoans: {
      total: {normal: 0, urgent: 0},
      active: {normal: 0, urgent: 0},
      requested: {normal: 0, urgent: 0}
    }, 
    installments: [],
    dataGateringDate: currentDate
  }
  extractedData.memFeeRemained =
    extractedData.memFeeToBePaid.value - extractedData.memFee.sum;
  extractedData.installmentRemained = 0;
  // (2) evaluate loans
  let loans = await findLoansByUser(data.userId);

  if (loans) {
    let activeLoans = loans.filter(row => row.loanStatus == "active");
    let requestedLoans = loans.filter(row => row.loanStatus == "requested");
    extractedData.numberOfLoans = {
      total: {
        normal: loans.filter(row => row.loanType == "normal").length,
        urgent: loans.filter(row => row.loanType == "urgent").length
        },
      active: {
        normal: activeLoans.filter(row => row.loanType == "normal").length,
        urgent: activeLoans.filter(row => row.loanType == "urgent").length
        },
      requested: {
        normal: requestedLoans.filter(row => row.loanType == "normal").length,
        urgent: requestedLoans.filter(row => row.loanType == "urgent").length
        }
    };

    if (activeLoans) {
      for (let loanIndex = 0; loanIndex < activeLoans.length; loanIndex++) {
        let installmentData = await findInstallmentsSummary(activeLoans[loanIndex].id);
        
        // find how many installments should be paid so far
        let loanPaymentDate = new Date(activeLoans[loanIndex].loanPaymentDate);
        let installmentToBePaid = 
          currentDate.getMonth() - loanPaymentDate.getMonth() +
          12 * (currentDate.getFullYear() - loanPaymentDate.getFullYear());

        if (currentDate.getDate() < loanPaymentDate.getDate()) {
          installmentToBePaid--;
        }

        extractedData.installments[loanIndex] = {
          loanId: activeLoans[loanIndex].id,
          loanPaymentDate: loanPaymentDate,
          installmentAmount: activeLoans[loanIndex].installmentAmount,
          installmentToBePaid: installmentToBePaid,
          installmentAmountToBePaid: installmentToBePaid * activeLoans[loanIndex].installmentAmount,
          ...installmentData[0]
        };
        extractedData.installmentRemained = extractedData.installmentRemained + 
        extractedData.installments[loanIndex].installmentAmountToBePaid
        - installmentData[0].sum;
      }
    }
  }
  return extractedData
};

module.exports = getPaymentData;