const sequelize = require("../configs/db");
const { DataTypes } = require("sequelize");
const Loan = require("../models/loan");
const User = require("../models/user");

const Guarantor = sequelize.define (
  "Guarantor",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    guarantorConfirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    adminConfirmation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    adminId: {
      type: DataTypes.INTEGER
    },
    attachment: {
      type: DataTypes.STRING
    }
  },
  { paranoid: true }
);

//define relationships
Loan.hasMany(Guarantor);
Guarantor.belongsTo(Loan);

User.hasMany(Guarantor);
Guarantor.belongsTo(User);

module.exports = Guarantor;