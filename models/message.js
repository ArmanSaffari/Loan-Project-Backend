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
    reciepantId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM("Error", "Warning", "General")
    },
    link: {
      type: DataTypes.STRING,
    },

  },
  { paranoid: true }
);

// define relationships
User.hasMany(Message);
Message.belongsTo(User);

module.exports = Message;