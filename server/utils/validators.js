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
    name: Joi.string().required().max(100).messages({
      'string.base': `Name should be a type of 'text'`,
      'string.empty': `Name cannot be an empty field`,
      'string.max': `Name should have a maximum length of {#limit}`,
      'any.required': `Name is a required field`
    }),
    description: Joi.string().required().max(500).messages({
      'string.base': `Description should be a type of 'text'`,
      'string.empty': `Description cannot be an empty field`,
      'string.max': `Description should have a maximum length of {#limit}`,
      'any.required': `Description is a required field`
    }),
    ingredients: Joi.array().items(Joi.string()).min(1).required().messages({
      'array.base': `Ingredients should be an array`,
      'array.min': `Should have at least {#limit} ingredient`,
      'any.required': `Ingredients are required`
    }),
    instructions: Joi.string().required().messages({
      'string.base': `Instructions should be a type of 'text'`,
      'string.empty': `Instructions cannot be an empty field`,
      'any.required': `Instructions are required`
    }),
    preparationTime: Joi.number().integer().min(1).required().messages({
      'number.base': `Preparation time should be a number`,
      'number.min': `Preparation time should be at least 1 minute`,
      'any.required': `Preparation time is required`
    }),
    cookingTime: Joi.number().integer().min(0).required().messages({
      'number.base': `Cooking time should be a number`,
      'number.min': `Cooking time should be a non-negative number`,
      'any.required': `Cooking time is required`
    }),
    servings: Joi.number().integer().min(1).required().messages({
      'number.base': `Servings should be a number`,
      'number.min': `Servings should be at least 1`,
      'any.required': `Servings is required`
    }),
    difficulty: Joi.string().valid('קל', 'בינוני', 'מאתגר').required().messages({
      'any.only': `Difficulty should be one of: קל, בינוני, מאתגר`,
      'any.required': `Difficulty is required`
    }),
    category: Joi.string().required().messages({
      'string.base': `Category should be a type of 'text'`,
      'string.empty': `Category cannot be an empty field`,
      'any.required': `Category is required`
    }),
    allergens: Joi.array().items(Joi.string()),
    image: Joi.any(),
  });

  return schema.validate(recipe, { abortEarly: false });
};

// Validate allergen data
export const validateAllergen = (allergen) => {
  const schema = Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.base': `Name should be a type of 'text'`,
      'string.empty': `Name cannot be an empty field`,
      'string.max': `Name should have a maximum length of {#limit}`,
      'any.required': `Name is a required field`
    }),
    hebrewName: Joi.string().required().max(50).messages({
      'string.base': `Hebrew name should be a type of 'text'`,
      'string.empty': `Hebrew name cannot be an empty field`,
      'string.max': `Hebrew name should have a maximum length of {#limit}`,
      'any.required': `Hebrew name is a required field`
    }),
    icon: Joi.string().required().messages({
      'string.base': `Icon should be a type of 'text'`,
      'string.empty': `Icon cannot be an empty field`,
      'any.required': `Icon is a required field`
    }),
    description: Joi.string().required().max(500).messages({
      'string.base': `Description should be a type of 'text'`,
      'string.empty': `Description cannot be an empty field`,
      'string.max': `Description should have a maximum length of {#limit}`,
      'any.required': `Description is a required field`
    }),
    symptoms: Joi.array().items(Joi.string()).min(1).max(10).required().messages({
      'array.base': `Symptoms should be an array`,
      'array.min': `Should have at least {#limit} symptom`,
      'array.max': `Should have at most {#limit} symptoms`,
      'any.required': `Symptoms are required`
    }),
    avoidList: Joi.array().items(Joi.string()).min(1).max(20).required().messages({
      'array.base': `Avoid list should be an array`,
      'array.min': `Should have at least {#limit} item to avoid`,
      'array.max': `Should have at most {#limit} items to avoid`,
      'any.required': `Avoid list is required`
    }),
    alternatives: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      description: Joi.string()
    })).max(10).messages({
      'array.max': `Should have at most {#limit} alternatives`
    }),
    severity: Joi.string().valid('Low', 'Medium', 'High').required().messages({
      'any.only': `Severity should be one of: Low, Medium, High`,
      'any.required': `Severity is required`
    })
  });

  return schema.validate(allergen, { abortEarly: false });
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