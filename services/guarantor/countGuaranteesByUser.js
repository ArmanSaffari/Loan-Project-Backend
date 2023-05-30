const Guarantor = require("../../models/guarantor");

const countGuaranteesByUser = async (data) => {
  try {
    const countOfGuarantees = await Guarantor.count({
      where: {
        UserId: data.userId,
        ...data.filter
      }
    });

    return countOfGuarantees
    
  } catch(err) {
    console.log("error is: ", err)
  }
};

module.exports = countGuaranteesByUser;
