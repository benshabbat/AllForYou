import Allergen from '../models/Allergen.js';

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