import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'מוצר לא נמצא' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};