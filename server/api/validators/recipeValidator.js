import Joi from 'joi';

export const validateRecipe = (recipe) => {
  const schema = Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().required().max(500),
    ingredients: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      amount: Joi.string().required(),
      unit: Joi.string().allow('')
    })).min(1).required(),
    instructions: Joi.array().items(Joi.string()).min(1).required(),
    preparationTime: Joi.number().integer().min(1).required(),
    cookingTime: Joi.number().integer().min(0).required(),
    servings: Joi.number().integer().min(1).required(),
    difficulty: Joi.string().valid('קל', 'בינוני', 'מאתגר').required(),
    category: Joi.string().required(),
    allergens: Joi.array().items(Joi.string()),
    image: Joi.string().allow(''),
    nutritionInfo: Joi.object({
      calories: Joi.number().min(0),
      protein: Joi.number().min(0),
      carbohydrates: Joi.number().min(0),
      fat: Joi.number().min(0)
    })
  });

  return schema.validate(recipe);
};