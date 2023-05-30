const Message = require("../../models/message");

const changeMessageToRead = async (data) => {
  // data must include userId and messageId

  try {
    const foundMessage = await Message.findOne({
      where: {
        id: data.messageId
      }
    });
    
    if (!foundMessage) {
      throw { message: "the message not found!" } 

    } else if (foundMessage.UserId != data.userId) {
      throw { message: "this is not your message!" }

    } else if (foundMessage.isRead == true) {
      return { message: 'the message has already read!' }

    } else {
      await foundMessage.update( {isRead: true} )
      return { message: 'message read!' }
    } 

  } catch (err) {
    throw err
  }
};

module.exports = changeMessageToRead;

