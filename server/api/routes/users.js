import express from "express";
import {
  register,
  login,
  getMe,
  toggleFavoriteRecipe,
  getFavoriteRecipes,
  updateAllergenPreferences,
  updateUserProfile,
  addToScanHistory,
  getScanHistory,
  getUserData,
  getUserAllergens,
  getUserActivities,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/favorites/:recipeId", protect, toggleFavoriteRecipe);
router.get("/favorites", protect, getFavoriteRecipes);
router.put("/allergen-preferences", protect, updateAllergenPreferences);
router.put("/profile", protect, updateUserProfile);
router.post("/scan-history", protect, addToScanHistory);
router.get("/scan-history", protect, getScanHistory);
router.get("/data", protect, getUserData); // הוספנו נתיב חדש
router.get("/allergens", protect, getUserAllergens);
router.get("/:userId/activities", protect, getUserActivities);

export default router;
