// Recipe types
export interface Recipe {
  _id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: 'קל' | 'בינוני' | 'מאתגר';
  category: string;
  allergens: string[];
  image?: string;
  nutritionInfo?: NutritionInfo;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  favorites: number;
  createdBy: string;
  isPublic: boolean;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: string;
}

export interface RecipeFilter {
  category?: string;
  allergens?: string[];
  difficulty?: Recipe['difficulty'];
  preparationTime?: {
    min?: number;
    max?: number;
  };
  cookingTime?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  tags?: string[];
  search?: string;
}

export interface RecipeCreateInput {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  difficulty: Recipe['difficulty'];
  category: string;
  allergens: string[];
  image?: File | string;
  nutritionInfo?: Partial<NutritionInfo>;
  tags: string[];
  isPublic: boolean;
}

export type RecipeUpdateInput = Partial<RecipeCreateInput> & {
  _id: string;
};

// Recipe comments
export interface RecipeComment {
  _id: string;
  recipeId: string;
  userId: string;
  username: string;
  content: string;
  rating?: number;
  replies?: RecipeComment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateInput {
  recipeId: string;
  content: string;
  rating?: number;
  parentId?: string; // for replies
}

// Recipe states
export interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  favorites: Recipe[];
  userRecipes: Recipe[];
  popularRecipes: Recipe[];
  recentRecipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  filters: RecipeFilter;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}