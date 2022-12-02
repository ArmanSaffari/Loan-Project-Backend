const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");

const Account = sequelize.define(
	"Account",
	{
		id:{
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		accountName:{
			type: DataTypes.STRING,
			allowNull: false
		},
		BankName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		balance: {
			type: DataTypes.DECIMAL(15,2),
			allowNull: false
		},
	},
	{ paranoid: true }
);

module.exports = Account;