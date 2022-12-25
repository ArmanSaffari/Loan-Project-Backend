const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user");
const Account = require("./account");

const Payment = sequelize.define(
  "Payment", 
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    referenceNo: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    confirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    confirmedAdminId: {
      type: DataTypes.INTEGER,
    },
    attachmentAddress: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  { paranoid: true }
)

// define relationships:
User.hasMany(Payment);
Payment.belongsTo(User);

Account.hasMany(Payment);
Payment.belongsTo(Account);

module.exports = Payment;