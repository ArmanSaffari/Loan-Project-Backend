const { DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
const User = require("./user");

//define model
const Parameter = sequelize.define(
	"Parameter",
	{
    parameter: {
      type: DataTypes.BOOLEAN,
      primaryKey: true,
      allowNull: false
    },
    value: {
			type: DataTypes.DECIMAL(15,2),
      allowNull: false
		},
    unit: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
	},
	{ paranoid: true }
);

//define relationships
User.hasMany(Parameter, {
  foreignKey: 'AdminId'
});
Parameter.belongsTo(User);

module.exports = Parameter;