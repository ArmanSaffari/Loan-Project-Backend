const Message = require("../../models/message");

const countTotalSentMessages = async (data) => {
  // data must at least include userId
  // optional: filter
  
  try {
    const filter = data.filter || {};

    const countOfTotalSentMessages = await Message.count({
      where: {
        UserId: data.userId,
        ...filter
      }
    });

    return countOfTotalSentMessages
  } catch(err) {
    throw err
  }
};

module.exports = countTotalSentMessages;