const sequelize = require("../configs/db");
const { DataTypes } = require("sequelize");

const Message = sequelize.define(
  "message",
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