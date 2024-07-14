import Joi from 'joi';

export const validateAllergen = (allergen) => {
  const schema = Joi.object({
    name: Joi.string().required().max(50),
    hebrewName: Joi.string().required().max(50),
    icon: Joi.string().required(),
    description: Joi.string().required().max(500),
    commonNames: Joi.array().items(Joi.string()).max(10),
    severity: Joi.string().valid('Low', 'Medium', 'High'),
    symptoms: Joi.array().items(Joi.string()).min(1).max(20).required(),
    avoidList: Joi.array().items(Joi.string()).min(1).max(50).required(),
    alternatives: Joi.array().items(Joi.string()).max(20)
  });

  return schema.validate(allergen);
};