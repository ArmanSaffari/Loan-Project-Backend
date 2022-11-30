const { DataTypes } = require ("sequelize");
const sequelize = require("../db");
const Account = require("./account");
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
			type: DataTypes.DECIMAL,
			allowNull: false
		},
		// userId: {
		// 	type: DataTypes.INTEGER,
		// 	references: {
		// 		model: User,
		// 		key: "id"
		// 	}
		// }
	},
	{}
);

//define relationships
User.hasMany(MembershipFee);
MembershipFee.belongsTo(User);

module.exports = MembershipFee;
