// Recipe Repository Implementation - Clean Architecture
// Following Repository Pattern with proper abstraction

import { IRepository, ILogger } from '../interfaces';
import { Recipe, RecipeStatus, DifficultyLevel } from '../domain/recipe';

export interface IRecipeRepository extends IRepository<Recipe> {
  findByTitle(title: string): Promise<Recipe[]>;
  findByAuthor(authorId: string): Promise<Recipe[]>;
  findByStatus(status: RecipeStatus): Promise<Recipe[]>;
  findByDifficulty(difficulty: DifficultyLevel): Promise<Recipe[]>;
  findByTags(tags: string[]): Promise<Recipe[]>;
  findByAllergens(allergenIds: string[]): Promise<Recipe[]>;
  findPublishedRecipes(): Promise<Recipe[]>;
  findFeaturedRecipes(): Promise<Recipe[]>;
  searchByIngredients(ingredients: string[]): Promise<Recipe[]>;
  findPopular(limit: number): Promise<Recipe[]>;
  findRecent(limit: number): Promise<Recipe[]>;
}

export class MongoRecipeRepository implements IRecipeRepository {
  constructor(
    private readonly recipeModel: any,
    private readonly logger: ILogger
  ) {}

  async findById(id: string): Promise<Recipe | null> {
    try {
      const recipeData = await this.recipeModel
        .findById(id)
        .populate('author', 'username profileImage')
        .populate('allergens');
      
      return recipeData ? Recipe.fromPersistence(recipeData.toObject()) : null;
    } catch (error) {
      this.logger.error('Failed to find recipe by ID', error as Error, { id });
      throw new Error('Database operation failed');
    }
  }

  async findAll(filters?: Record<string, any>): Promise<Recipe[]> {
    try {
      const query = this.buildQuery(filters);
      const recipesData = await this.recipeModel
        .find(query)
        .populate('author', 'username profileImage')
        .populate('allergens')
        .sort({ createdAt: -1 });
      
      return recipesData.map((recipeData: any) => 
        Recipe.fromPersistence(recipeData.toObject())
      );
    } catch (error) {
      this.logger.error('Failed to find recipes', error as Error, { filters });
      throw new Error('Database operation failed');
    }
  }

  async findByTitle(title: string): Promise<Recipe[]> {
    try {
      const recipesData = await this.recipeModel
        .find({ title: { $regex: title, $options: 'i' } })
        .populate('author', 'username profileImage')
        .populate('allergens');
      
      return recipesData.map((recipeData: any) => 
        Recipe.fromPersistence(recipeData.toObject())
      );
    } catch (error) {
      this.logger.error('Failed to find recipes by title', error as Error, { title });
      throw new Error('Database operation failed');
    }
  }

  async findByAuthor(authorId: string): Promise<Recipe[]> {
    return this.findAll({ author: authorId });
  }

  async findByStatus(status: RecipeStatus): Promise<Recipe[]> {
    return this.findAll({ status });
  }

  async findByDifficulty(difficulty: DifficultyLevel): Promise<Recipe[]> {
    return this.findAll({ difficulty });
  }

  async findByTags(tags: string[]): Promise<Recipe[]> {
    return this.findAll({ tags: { $in: tags } });
  }

  async findByAllergens(allergenIds: string[]): Promise<Recipe[]> {
    return this.findAll({ allergens: { $in: allergenIds } });
  }

  async findPublishedRecipes(): Promise<Recipe[]> {
    return this.findByStatus(RecipeStatus.PUBLISHED);
  }

  async findFeaturedRecipes(): Promise<Recipe[]> {
    return this.findAll({ featured: true, status: RecipeStatus.PUBLISHED });
  }

  async searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
    try {
      const query = {
        $and: ingredients.map(ingredient => ({
          'ingredients.name': { $regex: ingredient, $options: 'i' }
        })),
        status: RecipeStatus.PUBLISHED
      };

      const recipesData = await this.recipeModel
        .find(query)
        .populate('author', 'username profileImage')
        .populate('allergens');
      
      return recipesData.map((recipeData: any) => 
        Recipe.fromPersistence(recipeData.toObject())
      );
    } catch (error) {
      this.logger.error('Failed to search recipes by ingredients', error as Error, { ingredients });
      throw new Error('Database operation failed');
    }
  }

  async findPopular(limit: number = 10): Promise<Recipe[]> {
    try {
      const recipesData = await this.recipeModel
        .find({ status: RecipeStatus.PUBLISHED })
        .populate('author', 'username profileImage')
        .populate('allergens')
        .sort({ 'rating.average': -1, 'rating.count': -1 })
        .limit(limit);
      
      return recipesData.map((recipeData: any) => 
        Recipe.fromPersistence(recipeData.toObject())
      );
    } catch (error) {
      this.logger.error('Failed to find popular recipes', error as Error, { limit });
      throw new Error('Database operation failed');
    }
  }

  async findRecent(limit: number = 10): Promise<Recipe[]> {
    try {
      const recipesData = await this.recipeModel
        .find({ status: RecipeStatus.PUBLISHED })
        .populate('author', 'username profileImage')
        .populate('allergens')
        .sort({ createdAt: -1 })
        .limit(limit);
      
      return recipesData.map((recipeData: any) => 
        Recipe.fromPersistence(recipeData.toObject())
      );
    } catch (error) {
      this.logger.error('Failed to find recent recipes', error as Error, { limit });
      throw new Error('Database operation failed');
    }
  }

  async create(recipeEntity: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    try {
      const recipeData = (recipeEntity as any).toPersistence();
      const savedRecipe = await this.recipeModel.create(recipeData);
      
      this.logger.info('Recipe created successfully', { 
        recipeId: savedRecipe._id, 
        title: recipeData.title 
      });
      
      // Populate before returning
      const populatedRecipe = await this.recipeModel
        .findById(savedRecipe._id)
        .populate('author', 'username profileImage')
        .populate('allergens');
      
      return Recipe.fromPersistence(populatedRecipe.toObject());
    } catch (error) {
      this.logger.error('Failed to create recipe', error as Error);
      throw new Error('Database operation failed');
    }
  }

  async update(id: string, updates: Partial<Recipe>): Promise<Recipe | null> {
    try {
      const updateData = this.preparePersistenceUpdates(updates);
      
      const updatedRecipe = await this.recipeModel.findByIdAndUpdate(
        id,
        { $set: updateData, updatedAt: new Date() },
        { new: true }
      )
      .populate('author', 'username profileImage')
      .populate('allergens');

      if (!updatedRecipe) {
        return null;
      }

      this.logger.info('Recipe updated successfully', { recipeId: id });
      return Recipe.fromPersistence(updatedRecipe.toObject());
    } catch (error) {
      this.logger.error('Failed to update recipe', error as Error, { recipeId: id });
      throw new Error('Database operation failed');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.recipeModel.findByIdAndDelete(id);
      const success = result !== null;
      
      if (success) {
        this.logger.info('Recipe deleted successfully', { recipeId: id });
      }
      
      return success;
    } catch (error) {
      this.logger.error('Failed to delete recipe', error as Error, { recipeId: id });
      throw new Error('Database operation failed');
    }
  }

  async save(recipe: Recipe): Promise<Recipe> {
    try {
      const recipeData = recipe.toPersistence();
      const updatedRecipe = await this.recipeModel.findByIdAndUpdate(
        recipe.id,
        recipeData,
        { new: true, upsert: true }
      )
      .populate('author', 'username profileImage')
      .populate('allergens');

      this.logger.info('Recipe saved successfully', { recipeId: recipe.id });
      return Recipe.fromPersistence(updatedRecipe.toObject());
    } catch (error) {
      this.logger.error('Failed to save recipe', error as Error, { recipeId: recipe.id });
      throw new Error('Database operation failed');
    }
  }

  private buildQuery(filters?: Record<string, any>): Record<string, any> {
    if (!filters) return { status: { $ne: RecipeStatus.DELETED } };

    const query: Record<string, any> = { 
      status: filters.includeDeleted ? undefined : { $ne: RecipeStatus.DELETED }
    };

    if (filters.status) query.status = filters.status;
    if (filters.author) query.author = filters.author;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.featured !== undefined) query.featured = filters.featured;
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }
    if (filters.allergens && filters.allergens.length > 0) {
      query.allergens = { $in: filters.allergens };
    }
    if (filters.cookingTimeMax) {
      query.cookingTime = { $lte: filters.cookingTimeMax };
    }
    if (filters.preparationTimeMax) {
      query.preparationTime = { $lte: filters.preparationTimeMax };
    }
    if (filters.minRating) {
      query['rating.average'] = { $gte: filters.minRating };
    }
    if (filters.createdAfter) {
      query.createdAt = { $gte: new Date(filters.createdAfter) };
    }
    if (filters.createdBefore) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.createdBefore) };
    }

    // Remove undefined values
    Object.keys(query).forEach(key => {
      if (query[key] === undefined) {
        delete query[key];
      }
    });

    return query;
  }

  private preparePersistenceUpdates(updates: Partial<Recipe>): Record<string, any> {
    const updateData: Record<string, any> = {};

    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      updateData[key] = value;
    });

    return updateData;
  }
}