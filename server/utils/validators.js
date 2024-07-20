import Joi from 'joi';
import { validationResult } from 'express-validator';
import Allergen from '../models/Allergen.js';

// Validate allergens against the database
export const validateAllergens = async (allergens) => {
  const validAllergens = await Allergen.find({ _id: { $in: allergens } });
  if (validAllergens.length !== allergens.length) {
    throw new Error('One or more allergens are invalid');
  }
  return validAllergens.map(a => a._id);
};

// Validate alternatives and their associated allergens
export const validateAlternatives = async (alternatives) => {
  for (let alt of alternatives) {
    const allergen = await Allergen.findById(alt.allergen);
    if (!allergen) {
      throw new Error(`Allergen ${alt.allergen} is invalid`);
    }
  }
  return alternatives;
};

// Validate recipe data
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

// Validate allergen data
export const validateAllergen = (allergen) => {
  const schema = Joi.object({
    name: Joi.string().required().max(50),
    hebrewName: Joi.string().required().max(50),
    icon: Joi.string().required(),
    description: Joi.string().required().max(500),
    symptoms: Joi.array().items(Joi.string()).min(1).max(10).required(),
    avoidList: Joi.array().items(Joi.string()).min(1).max(20).required(),
    alternatives: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string()
    })).max(10),
    severity: Joi.string().valid('Low', 'Medium', 'High').required()
  });

  return schema.validate(allergen);
};

// Express-validator middleware
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