const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user");
const Account = require("./account");

//define model
const CostIncome = sequelize.define(
	"CostIncome",
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
    isIncome: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    title: {
			type: DataTypes.STRING,
      allowNull: false
		},
    category: {
      type: DataTypes.ENUM('profit', 'administeration fee', 'cost', 'lay off'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
		amount: {
			type: DataTypes.DECIMAL(15,2),
			allowNull: false
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
User.hasMany(CostIncome, {
  foreignKey: 'AdminId'
});
CostIncome.belongsTo(User);

Account.hasMany(CostIncome);
CostIncome.belongsTo(Account);

module.exports = CostIncome;