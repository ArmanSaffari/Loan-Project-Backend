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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
    },
    priority: {
      type: DataTypes.ENUM("warning", "info"),
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