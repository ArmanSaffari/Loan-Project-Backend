const Message = require("../../models/message");

const countTotalMessages = async (data) => {
  // data must at least include userId
  // optional: filter
  
  try {
    const filter = data.filter || {};

    const countOfTotalMessages = await Message.count({
      where: {
        UserId: data.userId,
        ...filter
      }
    });

    return countOfTotalMessages
  } catch(err) {
    throw err
  }
};

module.exports = countTotalMessages;