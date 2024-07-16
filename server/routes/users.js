import express from "express";
import {
  register,
  login,
  getMe,
  toggleFavoriteRecipe,
  getFavoriteRecipes,
  updateAllergenPreferences,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 * @body    { username, email, password }
 */
router.post("/register", register);

/**
 * @route   POST /api/users/login
 * @desc    Authenticate a user and get token
 * @access  Public
 * @body    { email, password }
 */
router.post("/login", login);

/**
 * @route   GET /api/users/me
 * @desc    Get current user's profile
 * @access  Private
 */
router.get("/me", protect, getMe);

router.post("/favorites/:recipeId", protect, toggleFavoriteRecipe);
router.get("/favorites", protect, getFavoriteRecipes);

router.put("/allergen-preferences", protect, updateAllergenPreferences);
router.put("/profile", protect, updateUserProfile);
export default router;
