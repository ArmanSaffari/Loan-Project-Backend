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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nationalCode: {
      type: DataTypes.STRING,
      allowNull: false,
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
    UserPictureAddress: {
      type: DataTypes.STRING,
    },
  },
  { paranoid: true }
);

module.exports = User;
