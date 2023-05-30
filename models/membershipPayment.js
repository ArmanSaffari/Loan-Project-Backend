
const sequelize = require("../configs/db");
const { DataTypes } = require("sequelize");

const Payment = require("./payment");

const MembershipPayment = sequelize.define(
  "MembershipPayment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  },
  {paranoid: true}
);

//define relationships:
Payment.hasMany(MembershipPayment);
MembershipPayment.belongsTo(Payment);

module.exports = MembershipPayment;