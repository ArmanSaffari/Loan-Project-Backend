const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
//create Models
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personnelCode: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    employmentStatus: {
      type: DataTypes.ENUM("permanent full-time", "temporary full-time", "part-time"),
    },
    homeAddress: {
      type: DataTypes.STRING,
    },
    zipCode: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isActiveUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    membershipDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    userPictureAddress: {
      type: DataTypes.STRING,
    },
  },
  { paranoid: true }
);

module.exports = User;
