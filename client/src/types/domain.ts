import { NutritionInfo } from './recipe';

// Allergen types
export interface Allergen {
  _id: string;
  name: string;
  hebrewName: string;
  icon: string;
  description: string;
  symptoms: string[];
  avoidList: string[];
  alternatives: Alternative[];
  severity: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
}

export interface Alternative {
  name: string;
  description: string;
  notes?: string;
}

export interface AllergenPreference {
  allergenId: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  confirmedBy?: 'user' | 'doctor' | 'test';
}

// Forum types
export interface ForumTopic {
  _id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  author: {
    _id: string;
    username: string;
  };
  posts: ForumPost[];
  postCount: number;
  lastActivity: string;
  isPinned: boolean;
  isLocked: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPost {
  _id: string;
  topicId: string;
  content: string;
  author: {
    _id: string;
    username: string;
    role: string;
  };
  replies?: ForumPost[];
  likes: number;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumCategory {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  topicCount: number;
  postCount: number;
  lastActivity?: string;
  order: number;
}

// Product scanning types
export interface Product {
  _id: string;
  barcode: string;
  name: string;
  brand?: string;
  description?: string;
  ingredients: string[];
  allergens: string[];
  nutritionInfo?: NutritionInfo;
  images?: string[];
  verified: boolean;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScanResult {
  success: boolean;
  product?: Product;
  allergenWarnings?: AllergenWarning[];
  message?: string;
}

export interface AllergenWarning {
  allergen: string;
  severity: 'low' | 'medium' | 'high';
  found: 'ingredients' | 'may_contain' | 'processed_in_facility';
  message: string;
}

export interface ScanHistory {
  _id: string;
  userId: string;
  barcode: string;
  productName: string;
  scannedAt: string;
  warnings: AllergenWarning[];
}

// Tips and recommendations
export interface Tip {
  _id: string;
  title: string;
  content: string;
  category: 'cooking' | 'shopping' | 'health' | 'lifestyle';
  tags: string[];
  author?: {
    _id: string;
    username: string;
  };
  likes: number;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  _id: string;
  userId: string;
  type: 'recipe_comment' | 'forum_reply' | 'system' | 'allergen_alert';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}