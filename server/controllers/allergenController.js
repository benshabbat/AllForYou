import Allergen from '../models/Allergen.js';
import { validateAllergen } from '../utils/validators.js';

export const getAllergens = async (req, res) => {
  try {
    const allergens = await Allergen.find();
    res.json(allergens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllergenById = async (req, res) => {
  try {
    const allergen = await Allergen.findById(req.params.id);
    if (!allergen) {
      return res.status(404).json({ message: 'Allergen not found' });
    }
    res.json(allergen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAllergen = async (req, res) => {
  const { error } = validateAllergen(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const allergen = new Allergen(req.body);
  try {
    const newAllergen = await allergen.save();
    res.status(201).json(newAllergen);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateAllergen = async (req, res) => {
  const { error } = validateAllergen(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedAllergen = await Allergen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAllergen) {
      return res.status(404).json({ message: 'Allergen not found' });
    }
    res.json(updatedAllergen);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAllergen = async (req, res) => {
  try {
    const allergen = await Allergen.findByIdAndDelete(req.params.id);
    if (!allergen) {
      return res.status(404).json({ message: 'Allergen not found' });
    }
    res.json({ message: 'Allergen deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};