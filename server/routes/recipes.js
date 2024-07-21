import express from "express";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import {
  getAllRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  getUserRecipes,
  toggleFavorite,
  getSearchSuggestions,
} from "../controllers/recipeController.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG and GIF are allowed.'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage })

const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: `Multer uploading error: ${err.message}` });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ message: `Unknown uploading error: ${err.message}` });
    }
    next();
  });
};

router.post("/", protect, upload.single('image'), createRecipe);
router.put("/:id", protect, handleUpload, updateRecipe);

router.get("/", optionalAuth, getAllRecipes);
router.get("/:id", optionalAuth, getRecipe);
router.get("/suggestions", getSearchSuggestions);
router.delete("/:id", protect, deleteRecipe);
router.post("/:id/rate", protect, rateRecipe);
router.post("/:id/favorite", protect, toggleFavorite);
router.get("/user/:userId", protect, getUserRecipes);

export default router;