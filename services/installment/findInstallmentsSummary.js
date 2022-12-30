const Installment = require("../../models/installment");
const sequelize = require("../../configs/db");

const findInstallmentsSummary = async (loanId) => {
  try {
    const foundInstallments = await Installment.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('amount')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'sum']
      ],
      where: {
        LoanId: loanId
      }
    });
    foundInstallments.forEach(row =>{
      if (row.dataValues.sum === null) { row.dataValues.sum = 0 }
    })
    return foundInstallments.map (row => row.dataValues)
  } catch (err) {
    console.log('error is: ', err)
  }
};


module.exports = findInstallmentsSummary;