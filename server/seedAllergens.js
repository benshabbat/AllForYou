import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Allergen from './models/Allergen.js';
import allergenSeedData from './allergenSeedData.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedAllergens = async () => {
  try {
    await Allergen.deleteMany();
    console.log('Allergens deleted');

    await Allergen.insertMany(allergenSeedData);
    console.log('Allergens seeded successfully');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAllergens();