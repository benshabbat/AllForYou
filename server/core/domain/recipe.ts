// Recipe Domain Entity - Clean Architecture DDD Implementation
// Single Responsibility Principle - Encapsulates recipe business logic
// Open/Closed Principle - Extensible through inheritance and events

import { BaseEntity, DomainEvent } from './base';

export enum RecipeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELETED = 'deleted'
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface Rating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Domain Events
export class RecipeCreatedEvent extends DomainEvent {
  constructor(
    public readonly recipeId: string,
    public readonly authorId: string,
    public readonly title: string
  ) {
    super('RecipeCreated');
  }
}

export class RecipePublishedEvent extends DomainEvent {
  constructor(
    public readonly recipeId: string,
    public readonly authorId: string,
    public readonly title: string
  ) {
    super('RecipePublished');
  }
}

export class RecipeRatedEvent extends DomainEvent {
  constructor(
    public readonly recipeId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly newAverage: number
  ) {
    super('RecipeRated');
  }
}

export class Recipe extends BaseEntity {
  private _title: string;
  private _description: string;
  private _ingredients: Ingredient[];
  private _instructions: string[];
  private _cookingTime: number; // minutes
  private _preparationTime: number; // minutes
  private _servings: number;
  private _difficulty: DifficultyLevel;
  private _status: RecipeStatus;
  private _author: string; // User ID
  private _images: string[];
  private _tags: string[];
  private _allergens: string[]; // Allergen IDs
  private _nutritionalInfo?: NutritionalInfo;
  private _rating: Rating;
  private _featured: boolean;
  private _views: number;
  private _favorites: number;

  constructor(
    id: string,
    title: string,
    description: string,
    ingredients: Ingredient[],
    instructions: string[],
    cookingTime: number,
    preparationTime: number,
    servings: number,
    difficulty: DifficultyLevel,
    author: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id, createdAt, updatedAt);
    
    this._title = this.validateTitle(title);
    this._description = description;
    this._ingredients = this.validateIngredients(ingredients);
    this._instructions = this.validateInstructions(instructions);
    this._cookingTime = this.validateTime(cookingTime);
    this._preparationTime = this.validateTime(preparationTime);
    this._servings = this.validateServings(servings);
    this._difficulty = difficulty;
    this._status = RecipeStatus.DRAFT;
    this._author = author;
    this._images = [];
    this._tags = [];
    this._allergens = [];
    this._rating = {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
    this._featured = false;
    this._views = 0;
    this._favorites = 0;

    // Add domain event
    this.addDomainEvent(new RecipeCreatedEvent(this._id, author, title));
  }

  // Getters
  get title(): string { return this._title; }
  get description(): string { return this._description; }
  get ingredients(): Ingredient[] { return [...this._ingredients]; }
  get instructions(): string[] { return [...this._instructions]; }
  get cookingTime(): number { return this._cookingTime; }
  get preparationTime(): number { return this._preparationTime; }
  get totalTime(): number { return this._cookingTime + this._preparationTime; }
  get servings(): number { return this._servings; }
  get difficulty(): DifficultyLevel { return this._difficulty; }
  get status(): RecipeStatus { return this._status; }
  get author(): string { return this._author; }
  get images(): string[] { return [...this._images]; }
  get mainImage(): string | null { return this._images[0] || null; }
  get tags(): string[] { return [...this._tags]; }
  get allergens(): string[] { return [...this._allergens]; }
  get nutritionalInfo(): NutritionalInfo | undefined { return this._nutritionalInfo; }
  get rating(): Rating { return { ...this._rating }; }
  get featured(): boolean { return this._featured; }
  get views(): number { return this._views; }
  get favorites(): number { return this._favorites; }

  // Business Logic Methods

  publish(): void {
    if (this._status === RecipeStatus.PUBLISHED) {
      throw new Error('Recipe is already published');
    }

    if (!this.isReadyForPublication()) {
      throw new Error('Recipe is not ready for publication');
    }

    this._status = RecipeStatus.PUBLISHED;
    this.touch();
    
    this.addDomainEvent(new RecipePublishedEvent(this._id, this._author, this._title));
  }

  unpublish(): void {
    if (this._status !== RecipeStatus.PUBLISHED) {
      throw new Error('Recipe is not published');
    }

    this._status = RecipeStatus.DRAFT;
    this.touch();
  }

  archive(): void {
    if (this._status === RecipeStatus.DELETED) {
      throw new Error('Cannot archive deleted recipe');
    }

    this._status = RecipeStatus.ARCHIVED;
    this._featured = false;
    this.touch();
  }

  delete(): void {
    this._status = RecipeStatus.DELETED;
    this._featured = false;
    this.touch();
  }

  updateTitle(title: string): void {
    const validTitle = this.validateTitle(title);
    this._title = validTitle;
    this.touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touch();
  }

  updateIngredients(ingredients: Ingredient[]): void {
    this._ingredients = this.validateIngredients(ingredients);
    this.touch();
  }

  updateInstructions(instructions: string[]): void {
    this._instructions = this.validateInstructions(instructions);
    this.touch();
  }

  updateTimes(cookingTime: number, preparationTime: number): void {
    this._cookingTime = this.validateTime(cookingTime);
    this._preparationTime = this.validateTime(preparationTime);
    this.touch();
  }

  updateServings(servings: number): void {
    this._servings = this.validateServings(servings);
    this.touch();
  }

  updateDifficulty(difficulty: DifficultyLevel): void {
    this._difficulty = difficulty;
    this.touch();
  }

  addImage(imageUrl: string): void {
    if (!imageUrl.trim()) {
      throw new Error('Image URL cannot be empty');
    }

    if (!this._images.includes(imageUrl)) {
      this._images.push(imageUrl);
      this.touch();
    }
  }

  removeImage(imageUrl: string): void {
    const index = this._images.indexOf(imageUrl);
    if (index > -1) {
      this._images.splice(index, 1);
      this.touch();
    }
  }

  setMainImage(imageUrl: string): void {
    if (!this._images.includes(imageUrl)) {
      throw new Error('Image must be added to recipe before setting as main');
    }

    // Move image to first position
    const index = this._images.indexOf(imageUrl);
    this._images.splice(index, 1);
    this._images.unshift(imageUrl);
    this.touch();
  }

  addTag(tag: string): void {
    const cleanTag = tag.toLowerCase().trim();
    if (cleanTag && !this._tags.includes(cleanTag)) {
      this._tags.push(cleanTag);
      this.touch();
    }
  }

  removeTag(tag: string): void {
    const cleanTag = tag.toLowerCase().trim();
    const index = this._tags.indexOf(cleanTag);
    if (index > -1) {
      this._tags.splice(index, 1);
      this.touch();
    }
  }

  addAllergen(allergenId: string): void {
    if (!this._allergens.includes(allergenId)) {
      this._allergens.push(allergenId);
      this.touch();
    }
  }

  removeAllergen(allergenId: string): void {
    const index = this._allergens.indexOf(allergenId);
    if (index > -1) {
      this._allergens.splice(index, 1);
      this.touch();
    }
  }

  updateNutritionalInfo(nutritionalInfo: NutritionalInfo): void {
    this._nutritionalInfo = { ...nutritionalInfo };
    this.touch();
  }

  addRating(rating: number): void {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    // Update rating distribution
    this._rating.distribution[rating as keyof typeof this._rating.distribution]++;
    this._rating.count++;

    // Recalculate average
    const total = Object.entries(this._rating.distribution)
      .reduce((sum, [stars, count]) => sum + (parseInt(stars) * count), 0);
    
    const oldAverage = this._rating.average;
    this._rating.average = Math.round((total / this._rating.count) * 10) / 10;

    this.touch();
    
    this.addDomainEvent(new RecipeRatedEvent(
      this._id,
      '', // userId would come from the use case
      rating,
      this._rating.average
    ));
  }

  setFeatured(featured: boolean): void {
    if (featured && this._status !== RecipeStatus.PUBLISHED) {
      throw new Error('Only published recipes can be featured');
    }

    this._featured = featured;
    this.touch();
  }

  incrementViews(): void {
    this._views++;
    // Don't call touch() for views as it's not considered a significant update
  }

  incrementFavorites(): void {
    this._favorites++;
    this.touch();
  }

  decrementFavorites(): void {
    if (this._favorites > 0) {
      this._favorites--;
      this.touch();
    }
  }

  // Query Methods

  isPublished(): boolean {
    return this._status === RecipeStatus.PUBLISHED;
  }

  isDraft(): boolean {
    return this._status === RecipeStatus.DRAFT;
  }

  isArchived(): boolean {
    return this._status === RecipeStatus.ARCHIVED;
  }

  isDeleted(): boolean {
    return this._status === RecipeStatus.DELETED;
  }

  isFeatured(): boolean {
    return this._featured && this.isPublished();
  }

  hasAllergen(allergenId: string): boolean {
    return this._allergens.includes(allergenId);
  }

  hasTag(tag: string): boolean {
    return this._tags.includes(tag.toLowerCase().trim());
  }

  isReadyForPublication(): boolean {
    return (
      this._title.trim().length > 0 &&
      this._description.trim().length > 0 &&
      this._ingredients.length > 0 &&
      this._instructions.length > 0 &&
      this._cookingTime > 0 &&
      this._preparationTime > 0 &&
      this._servings > 0
    );
  }

  // Persistence Methods

  toPersistence(): any {
    return {
      _id: this._id,
      title: this._title,
      description: this._description,
      ingredients: this._ingredients,
      instructions: this._instructions,
      cookingTime: this._cookingTime,
      preparationTime: this._preparationTime,
      servings: this._servings,
      difficulty: this._difficulty,
      status: this._status,
      author: this._author,
      images: this._images,
      tags: this._tags,
      allergens: this._allergens,
      nutritionalInfo: this._nutritionalInfo,
      rating: this._rating,
      featured: this._featured,
      views: this._views,
      favorites: this._favorites,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  static fromPersistence(data: any): Recipe {
    const recipe = new Recipe(
      data._id,
      data.title,
      data.description,
      data.ingredients || [],
      data.instructions || [],
      data.cookingTime || 0,
      data.preparationTime || 0,
      data.servings || 1,
      data.difficulty || DifficultyLevel.MEDIUM,
      data.author,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );

    // Set additional properties
    recipe._status = data.status || RecipeStatus.DRAFT;
    recipe._images = data.images || [];
    recipe._tags = data.tags || [];
    recipe._allergens = data.allergens || [];
    recipe._nutritionalInfo = data.nutritionalInfo;
    recipe._rating = data.rating || {
      average: 0,
      count: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
    recipe._featured = data.featured || false;
    recipe._views = data.views || 0;
    recipe._favorites = data.favorites || 0;

    // Clear domain events for reconstructed entities
    recipe.clearEvents();

    return recipe;
  }

  // Validation Methods

  private validateTitle(title: string): string {
    if (!title || title.trim().length === 0) {
      throw new Error('Recipe title is required');
    }
    
    if (title.trim().length > 100) {
      throw new Error('Recipe title must be 100 characters or less');
    }

    return title.trim();
  }

  private validateIngredients(ingredients: Ingredient[]): Ingredient[] {
    if (!ingredients || ingredients.length === 0) {
      throw new Error('Recipe must have at least one ingredient');
    }

    return ingredients.map(ingredient => {
      if (!ingredient.name || ingredient.name.trim().length === 0) {
        throw new Error('Ingredient name is required');
      }
      
      if (ingredient.amount <= 0) {
        throw new Error('Ingredient amount must be positive');
      }

      if (!ingredient.unit || ingredient.unit.trim().length === 0) {
        throw new Error('Ingredient unit is required');
      }

      return {
        ...ingredient,
        name: ingredient.name.trim(),
        unit: ingredient.unit.trim()
      };
    });
  }

  private validateInstructions(instructions: string[]): string[] {
    if (!instructions || instructions.length === 0) {
      throw new Error('Recipe must have at least one instruction');
    }

    const cleanInstructions = instructions
      .map(instruction => instruction.trim())
      .filter(instruction => instruction.length > 0);

    if (cleanInstructions.length === 0) {
      throw new Error('Recipe must have at least one non-empty instruction');
    }

    return cleanInstructions;
  }

  private validateTime(time: number): number {
    if (time < 0) {
      throw new Error('Time must be non-negative');
    }
    return time;
  }

  private validateServings(servings: number): number {
    if (servings <= 0) {
      throw new Error('Servings must be positive');
    }
    return servings;
  }
}