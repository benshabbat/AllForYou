import Allergen from '../models/Allergen.js';

export const getAllergens = async (req, res) => {
  try {
    const allergens = await Allergen.find();
    res.json(allergens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAllergen = async (req, res) => {
  const allergen = new Allergen(req.body);
  try {
    const newAllergen = await allergen.save();
    res.status(201).json(newAllergen);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ... Add other CRUD operations (getAllergen, updateAllergen, deleteAllergen) ...