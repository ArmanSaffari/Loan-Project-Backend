const findMemFee = require("../memFee/findMemFeeByUser");

const memFeeToBePaid = async (givenDate, userId) => {
  /*
  this function returns data of membership fee and related payments for a specified userId
  data will be only before the givenDate provided as argument
  */

  // return list of Membership Fees have been set so far:
  const memFeeList = await findMemFee({userId: userId});

  console.log("memFeeList:", memFeeList)
  if (memFeeList) {
    // filter ones that are before the given date:
    let memFeeBeforeGivenDate = memFeeList.filter(
      (memFee) => new Date(memFee.effectiveFrom) <= givenDate
    );

    // filter ones that are NOT confirmed yet:
    let unconfirmedMemFeeList =
      memFeeBeforeGivenDate.filter(memFee => memFee.confirmation == false);
    
      // check whether there are still membership fee remained uncinfirmed:
    if (unconfirmedMemFeeList === []) {
      return {
        message: "Payment can not be processed while there is still membership fee request unconfirmed!",
        value: false,
      }
    } else {

      // find the last Memership Fee:
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
        value: toBePaid,
        lastMemFee: lastMemFee,
        lastMemFeeEffectiveFrom: memFeeBeforeGivenDate[0].effectiveFrom,
        message: "",
      }  
    }
  } else {
    return {
      value: 0,
      lastMemFee: 0,
      lastMemFeeEffectiveFrom: "",
      message: "There has not been any membershio fee set yet!",
    }  
  }
}
  

module.exports = memFeeToBePaid;