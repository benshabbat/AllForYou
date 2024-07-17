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

const router = express.Router();

// Public routes
router.get("/", optionalAuth, getAllRecipes);
router.get("/:id", optionalAuth, getRecipe);

// Protected routes
router.use(protect);
router.get("/suggestions", getSearchSuggestions);
router.post("/", createRecipe);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);
router.post("/:id/rate", rateRecipe);
router.post("/:id/favorite", protect, toggleFavorite);
router.get("/user/:userId", getUserRecipes);

export default router;
