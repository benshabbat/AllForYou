import Allergen from '../../models/Allergen.js';
import { validateAllergen } from '../../utils/validators.js';
import { ERROR_MESSAGES } from '../../constants/errorMessages.js';

// Pagination helper
const paginate = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(parseInt(limit));
};

// Get all allergens with pagination
export const getAllergens = async (req, res) => {
  try {
    const { name, severity, page = 1, limit = 10 } = req.query;
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

    const allergens = await paginate(Allergen.find(query), page, limit);
    res.json(allergens);
  } catch (error) {
    console.error('Error fetching allergens:', error);
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message });
  }
};

// Get allergen by ID
export const getAllergenById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // בדיקה שה-ID תקין
    if (!id || id === 'null' || id === 'undefined') {
      return res.status(400).json({ message: 'Invalid allergen ID provided' });
    }

    const allergen = await Allergen.findById(id);
    if (!allergen) {
      return res.status(404).json({ message: ERROR_MESSAGES.ALLERGEN_NOT_FOUND });
    }
    res.json(allergen);
  } catch (error) {
    console.error('Error fetching allergen by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new allergen
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

// Update an allergen
export const updateAllergen = async (req, res) => {
  const { error } = validateAllergen(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const updatedAllergen = await Allergen.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedAllergen) {
      return res.status(404).json({ message: ERROR_MESSAGES.ALLERGEN_NOT_FOUND });
    }
    res.json(updatedAllergen);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an allergen
export const deleteAllergen = async (req, res) => {
  try {
    const allergen = await Allergen.findByIdAndDelete(req.params.id);
    if (!allergen) {
      return res.status(404).json({ message: ERROR_MESSAGES.ALLERGEN_NOT_FOUND });
    }
    res.json({ message: 'Allergen deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search allergens with filters
export const searchAllergens = async (req, res) => {
  try {
    const { query, severity, symptom, page = 1, limit = 10 } = req.query;
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

    const allergens = await paginate(
      Allergen.find(searchQuery).select('name hebrewName icon description symptoms avoidList alternatives severity'),
      page,
      limit
    );

    res.json(allergens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get allergens by symptom
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

// Get allergens by IDs
export const getAllergensByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ message: ERROR_MESSAGES.INVALID_IDS });
    }

    const allergenIds = ids.split(',');
    const allergens = await Allergen.find({ _id: { $in: allergenIds } });

    res.json(allergens);
  } catch (error) {
    console.error('Error fetching allergens by IDs:', error);
    res.status(500).json({ message: ERROR_MESSAGES.FETCH_ERROR, error: error.message });
  }
};