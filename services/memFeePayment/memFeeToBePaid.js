const findMemFee = require("../memFee/findMemFee");

const memFeeToBePaid = async (givenDate, userId) => {
  /*this function returns data of membership fee and related payments for a specified userId
  data will be only before the givenDate provided as argument
  */
 console.log("first of memFeeToBePaid")
  const memFeeList = await findMemFee(userId);

  console.log("memFeeList: ", memFeeList)

  if (memFeeList) {
    let memFeeBeforeGivenDate = memFeeList.filter(
      (memFee) => new Date(memFee.effectiveFrom) <= givenDate
    );
    let unconfirmedMemFeeList =
      memFeeBeforeGivenDate.filter(memFee => memFee.confirmation == false);
    
    if (unconfirmedMemFeeList === []) {
      return {
        message: "Payment can not be processed while there is still membership fee request unconfirmed!",
        value: false,
      }
    } else {
      let lastMemFee = memFeeBeforeGivenDate[0].monthlyMembershipFee;
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
        return parseFloat(accumulator) + parseFloat(thisPeriodPayment)
      },0);
      
      return {
        message: "",
        value: toBePaid,
        lastMemFee: lastMemFee,
        lastMemFeeEffectiveFrom: memFeeBeforeGivenDate[0].effectiveFrom
      }  
    }
  } else {
    return {
      message: "There has not been any membershio fee set yet!",
      value: 0,
      lastMemFee: 0,
      lastMemFeeEffectiveFrom: ""
    }  
  }
}
  

module.exports = memFeeToBePaid;