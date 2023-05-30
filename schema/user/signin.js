const Joi = require("joi");

const schema = Joi.object({
  emailAddress: Joi.string().email().max(255).required(),
  password: Joi.string().max(255).required(),
});

const signinValidation = async (signinData) => {
  const { error } = await schema.validateAsync(signinData);
  if (error) {
    throw error;
  }
};

module.exports = signinValidation;
