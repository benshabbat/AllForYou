// User related types
export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  allergenPreferences: string[];
  favorites: string[];
  lastLogin?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  bio?: string;
  profilePicture?: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
    };
    privacy: {
      showEmail: boolean;
      showFavorites: boolean;
    };
  };
  stats: {
    recipesCreated: number;
    recipesLiked: number;
    commentsPosted: number;
    forumPostsCreated: number;
  };
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserLogin {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordReset {
  token: string;
  password: string;
  confirmPassword: string;
}