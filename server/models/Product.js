import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  brands: String,
  quantity: String,
  ingredients_text: String,
  nutriments: {
    energy_100g: Number,
    proteins_100g: Number,
    carbohydrates_100g: Number,
    fat_100g: Number,
  },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);