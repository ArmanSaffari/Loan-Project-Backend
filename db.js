const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("Loan_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
