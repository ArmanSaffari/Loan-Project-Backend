const { DataTypes } = require ("sequelize");
const sequelize = require("../configs/db");
const User = require("./user")

//define model
const MembershipFee = sequelize.define(
	"MembershipFee",
	{
		id:{
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		monthlyMembershipFee: {
			type: DataTypes.DECIMAL(15,2),
			allowNull: false
		},
		effectiveFrom: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		confirmation: {
			type: DataTypes.BOOLEAN,
			defaultValue: false
		},
		confirmedAdminId: {
      type: DataTypes.INTEGER,
    }
	},
	{ paranoid: true }
);

//define relationships
User.hasMany(MembershipFee);
MembershipFee.belongsTo(User);

module.exports = MembershipFee;
