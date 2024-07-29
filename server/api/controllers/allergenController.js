import Allergen from '../../models/Allergen.js';
import { validateAllergen } from '../../utils/validators.js';

export const getAllergens = async (req, res) => {
  try {
    const { name, severity } = req.query;
    let query = {};

    if (name) {
      query.$or = [
        { name: { $regex: name, $options: 'i' } },
        { hebrewName: { $regex: name, $options: 'i' } },
        { commonNames: { $in: [new RegExp(name, 'i')] } }
      ];
    }

    if (severity) {
      query.severity = severity;
    }

    const allergens = await Allergen.find(query);
    res.json(allergens);
  } catch (error) {
    console.error('Error fetching allergens:', error);
    res.status(500).json({ message: 'שגיאה בטעינת האלרגנים', error: error.message });
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
    const updatedAllergen = await Allergen.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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

export const searchAllergens = async (req, res) => {
  try {
    const { query, severity, symptom } = req.query;
    let searchQuery = {};

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { hebrewName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    if (severity) {
      searchQuery.severity = severity;
    }

    if (symptom) {
      searchQuery.symptoms = { $regex: symptom, $options: 'i' };
    }

    const allergens = await Allergen.find(searchQuery)
      .select('name hebrewName icon description symptoms avoidList alternatives severity');

    res.json(allergens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllergensBySymptom = async (req, res) => {
  try {
    const { symptom } = req.params;
    const allergens = await Allergen.find({ symptoms: { $regex: symptom, $options: 'i' } })
      .select('name hebrewName icon description symptoms avoidList alternatives severity');

    res.json(allergens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllergensByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ message: 'יש לספק רשימת מזהים של אלרגנים' });
    }

    const allergenIds = ids.split(',');
    const allergens = await Allergen.find({ _id: { $in: allergenIds } });

    res.json(allergens);
  } catch (error) {
    console.error('Error fetching allergens by IDs:', error);
    res.status(500).json({ message: 'שגיאה בטעינת האלרגנים', error: error.message });
  }
};