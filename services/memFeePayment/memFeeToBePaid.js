const findMemFee = require("../memFee/findMemFee");

const memFeeToBePaid = async (givenDate, userId) => {
  const memFeeList = await findMemFee(userId);
  let memFeeBeforeGivenDate = memFeeList.filter(
    (memFee) => new Date(memFee.effectiveFrom) <= givenDate
  )
  let unconfirmedMemFeeList =
    memFeeBeforeGivenDate.filter(memFee => memFee.confirmation == false);
  
  if (unconfirmedMemFeeList === []) {
    return {
      message: "Payment can not be processed while there is still membership fee request unconfirmed!",
      value: false,
      memFeeBeforeGivenDate: memFeeBeforeGivenDate,
      unconfirmedMemFeeList: unconfirmedMemFeeList,
      memFeeList: memFeeList
    }
  } else {
    memFeeBeforeGivenDate = memFeeBeforeGivenDate.reverse();
    const toBePaid = memFeeBeforeGivenDate.reduce( (accumulator, value, index, array) => {
      let startDate = new Date (value.effectiveFrom);
      let endDate =
        (index == array.length - 1) ?
        givenDate : new Date(array[index+1].effectiveFrom);
      let thisPeriodPayment = (value.monthlyMembershipFee *
        (endDate.getMonth() - startDate.getMonth() +
        12 * (endDate.getFullYear() - startDate.getFullYear()))
        )
      return parseFloat(accumulator) + parseFloat(thisPeriodPayment);
    },0);
    
    return {
      message: "",
      value: toBePaid
    }  
  }
}
  

module.exports = memFeeToBePaid;