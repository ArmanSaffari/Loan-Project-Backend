const Message = require("../../models/message");

const checkSentMessage = async (data) => {
  // data must at least include: userId
  // optional: filter, order, limit, offset

  try {
    const filter = data.filter || {};

    let options = {};
    if (data.limit) Object.assign(options, {limit: parseInt(data.limit)});
    if (data.offset) Object.assign(options, {offset: parseInt(data.offset)});
    if (data.order) Object.assign(options, {order: [[ data.order ,"DESC" ]]});
    
    const foundMessage = await Message.findAll({
      where: {
        UserId: data.userId,
        ...filter
      },
      ...options
    });

    return (foundMessage.length === 0) ? false : foundMessage.map((row)=> row.dataValues)
  
  } catch (err) {
    throw err
  }
};

module.exports = checkSentMessage;