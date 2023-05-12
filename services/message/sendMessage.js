const Message = require("../../models/message");

const sendMessage = async (data) => {
  console.log("Message Data is:", data)
  try {
    await Message.create(data);
  } catch (err) {
    throw err
  }
};

module.exports = sendMessage;