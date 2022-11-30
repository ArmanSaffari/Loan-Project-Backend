const { DataTypes } = require("sequelize");
const sequelize = require("../db");

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
			type: DataTypes.DECIMAL,
			allowNull: false
		},
	}
	,{}
);

module.exports = Account;