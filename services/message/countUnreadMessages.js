const Message = require("../../models/message");

const countUnreadMessages = async (data) => {
  // data must at least include userId
  
  try {
    const filter = data.filter || {};

    const countOfUnreadMessages = await Message.count({
      where: {
        UserId: data.userId,
        isRead: true
      }
    });

    return countOfUnreadMessages
  } catch(err) {
    throw err
  }
};

module.exports = countUnreadMessages;