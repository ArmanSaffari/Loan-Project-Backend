const Joi = require("joi");

const schema = Joi.object({
  emailAddress: Joi.string().email().max(255).required(),
  password: Joi.string().max(255).required(),
  firstName: Joi.string().max(255).required(),
  lastName: Joi.string().max(255).required(),
  personnelCode: Joi.number().required(),
  nationalCode: Joi.string().required(),
  employmentStatus: Joi.string().valid(
    "permanent full-time",
    "temporary full-time",
    "part-time"
  ),
  homeAddress: Joi.string().max(255),
  zipCode: Joi.string().max(255),
  phoneNumber: Joi.string().pattern(new RegExp("^[0-9]{10,14}")),
});

const registerValidation = async (registerData) => {
  const { error } = await schema.validateAsync(registerData);
  if (error) {
    throw error;
  }
};

module.exports = registerValidation;
