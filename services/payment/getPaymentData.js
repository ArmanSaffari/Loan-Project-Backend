const memFeeToBePaid = require("../memFeePayment/memFeeToBePaid");
const sumOfMemFee = require("../memFeePayment/sumOfMemFee");
const findLoansByUser = require("../loan/findLoansByUser");
const findInstallmentsSummary = require("../installment/findInstallmentsSummary");

const getPaymentData = async (data) => {
  // data must include userId and membershipDate
  
  let currentDate = new Date();
  let membershipDate = new Date(data.membershipDate);

  // (1) create DATA (extractedData):
  let extractedData = {
    userId: data.userId,
    membershipDate: membershipDate
  }

  // (2) Membership fee payments:
  // (2-1) Membership fee MUST be paid so far:
  // It returns: value; lastMemFee; lastMemFeeEffectiveFrom; message
  extractedData.memFeeToBePaid = await memFeeToBePaid(currentDate, data.userId),
  
  // (2-2) Membership Fee HAS BEEN PAID so far:
  // It returns: count; sum

  extractedData.memFee = await sumOfMemFee(data.userId),

  // (2-3) Membership Fee REMAINED to be paid up to now:
  extractedData.memFeeRemained =
    extractedData.memFeeToBePaid.value - extractedData.memFee.sum;

  // (3) Loans:
  extractedData.numberOfLoans = {
    total: {normal: 0, urgent: 0},
    active: {normal: 0, urgent: 0},
    requested: {normal: 0, urgent: 0}
  },

  extractedData.installments = [],
  extractedData.dataGatheringDate = currentDate

  
  extractedData.installmentRemained = 0;

  // (2) evaluate loan:
  let loans = await findLoansByUser(data.userId);

  if (loans) {
    let activeLoans = loans.filter(row => row.loanStatus == "active");
    let requestedLoans = loans.filter(row => row.loanStatus == "requested");
    let waitlistedLoans = loans.filter(row => row.loanStatus == "waitlisted");
    let rejectedLoans = loans.filter(row => row.loanStatus == "rejected");
    let terminatedLoans = loans.filter(row => row.loanStatus == "terminated");

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
      },
      waitlisted: {
        normal: waitlistedLoans.filter(row => row.loanType == "normal").length,
        urgent: waitlistedLoans.filter(row => row.loanType == "urgent").length
      },
      rejected: {
        normal: rejectedLoans.filter(row => row.loanType == "normal").length,
        urgent: rejectedLoans.filter(row => row.loanType == "urgent").length
      },
      terminated: {
        normal: terminatedLoans.filter(row => row.loanType == "normal").length,
        urgent: terminatedLoans.filter(row => row.loanType == "urgent").length
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
          installmentAmountToBePaid: parseFloat((installmentToBePaid * activeLoans[loanIndex].installmentAmount).toFixed(2)),
          ...installmentData[0]
        };
        extractedData.installmentRemained = parseFloat(extractedData.installmentRemained) + 
        parseFloat(extractedData.installments[loanIndex].installmentAmountToBePaid)
        - installmentData[0].sum;
      }
    }
  }

  return extractedData
};

module.exports = getPaymentData;