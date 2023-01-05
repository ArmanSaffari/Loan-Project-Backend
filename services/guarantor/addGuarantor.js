const Guarantor = require("../../models/guarantor");

const addGuarantor = async (data) => {
  await Guarantor.create(data);
};

module.exports = addGuarantor;