const sequelize = require("../configs/db");
const { DataTypes } = require("sequelize");
const User = require("../models/user");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("Error", "Warning", "General"),
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isFlag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  },
  { paranoid: true }
);

// define relationships:
// this is the reciepent of the message (UserId)
User.hasMany(Message);
Message.belongsTo(User); 

module.exports = Message;