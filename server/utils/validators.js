import Joi from 'joi';
import { validationResult } from 'express-validator';
import Allergen from '../models/Allergen';

export const validateAllergens = async (allergens) => {
  const validAllergens = await Allergen.find({ _id: { $in: allergens } });
  if (validAllergens.length !== allergens.length) {
    throw new Error('אחד או יותר מהאלרגנים אינם תקפים');
  }
  return validAllergens.map(a => a._id);
};

export const validateAlternatives = async (alternatives) => {
  for (let alt of alternatives) {
    const allergen = await Allergen.findById(alt.allergen);
    if (!allergen) {
      throw new Error(`האלרגן ${alt.allergen} אינו תקף`);
    }
  }
  return alternatives;
};



export const validateRecipe = (recipe) => {
  const schema = Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().required().max(500),
    ingredients: Joi.array().items(Joi.string()).min(1).required(),
    instructions: Joi.string().required(),
    preparationTime: Joi.number().integer().min(1).required(),
    cookingTime: Joi.number().integer().min(0).required(),
    servings: Joi.number().integer().min(1).required(),
    difficulty: Joi.string().valid('קל', 'בינוני', 'מאתגר').required(),
    category: Joi.string().required(),
    allergens: Joi.array().items(Joi.string()),
    image: Joi.string().uri().allow(''),
  });

  return schema.validate(recipe);
};
export const validateAllergen = (allergen) => {
    const schema = Joi.object({
      name: Joi.string().required().max(50),
      hebrewName: Joi.string().required().max(50),
      icon: Joi.string().required(),
      description: Joi.string().required().max(500),
      symptoms: Joi.array().items(Joi.string()).min(1).max(10).required(),
      avoidList: Joi.array().items(Joi.string()).min(1).max(20).required(),
      alternatives: Joi.array().items(Joi.string()).max(10),
      severity: Joi.string().valid('Low', 'Medium', 'High').required()
    });
  
    return schema.validate(allergen);
  };


  
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

