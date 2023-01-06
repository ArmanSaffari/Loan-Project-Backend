const CostIncome = require("../../models/costIncome");

const addCostIncome = async (data) => {
  await CostIncome.create(data);
};

module.exports = addCostIncome;