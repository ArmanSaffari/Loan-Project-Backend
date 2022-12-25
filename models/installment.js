const sequelize = require("../configs/db");
const { DataTypes } = require("sequelize");

const Loan = require("./loan");
const Payment = require("./payment");

const Installment = sequelize.define(
  "Installment",
  {
    id: {
      type: DataTypes.INTEGER,
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
Loan.hasMany(Installment);
Installment.belongsTo(Loan);

Payment.hasMany(Installment);
Installment.belongsTo(Payment);

module.exports = Installment;