const Loan = require("../../models/loan");

const findLoansByUser = async (data) => {
let foundLoans = [];
  try {
    if (data.userId) {
      foundLoans = await Loan.findAll({
        where: {
          Userid: data.userId,
          ...data.filter
        },
        order: [
          [ data.order ,"DESC" ]
        ],
        limit: parseInt(data.limit),
        offset: parseInt(data.offset)
      });

    } else {
      foundLoans = await Loan.findAll({
        where: {
          UserId: data
        }
      });
    }
    

    return foundLoans.map(row => row.dataValues)

  } catch (err) {
    console.log('error is: ', err)
  }
};

module.exports = findLoansByUser;


