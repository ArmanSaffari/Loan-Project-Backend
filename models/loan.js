const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user");
const Account = require("./account");

//define model
const Loan = sequelize.define(
	"Loan",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		loanAmount: {
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		loanType: { // normal / urgent
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "normal"
		},
		loanPaymentDate: {
			type: DataTypes.DATEONLY,
		},
		loanStatus: { //requested / active / terminated
			type: DataTypes.STRING,
			allowNull: false
		},
		administerationFee: {
			type: DataTypes.DECIMAL
		},
		installmentNo: {
			type: DataTypes.INTEGER
		},
		installmentAmount: {
			type: DataTypes.DECIMAL
		},
		chequeNo: {
			type: DataTypes.STRING
		},
		comment: {
			type: DataTypes.STRING
		},
		attachment: {
			type: DataTypes.STRING
		}
	},
	{ paranoid: true }
);

//define relationships
User.hasMany(Loan);
Loan.belongsTo(User);

Account.hasMany(Loan);
Loan.belongsTo(Account);

module.exports = Loan;