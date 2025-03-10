// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  YOB: number;
  gender: boolean; // true for male, false for female
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  YOB: number;
  gender: boolean;
  isAdmin: boolean;
  token?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileUpdateData {
  name?: string;
  YOB?: number;
  gender?: boolean;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Brand Types
export interface Brand {
  _id: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  rating: number;
  author: AuthUser;
  createdAt: string;
  updatedAt: string;
}

export interface CommentFormData {
  content: string;
  rating: number;
}

// Perfume Types
export interface Perfume {
  _id: string;
  perfumeName: string;
  price: number;
  volume: number;
  concentration: string;
  description: string;
  ingredients: string;
  targetAudience: string;
  uri: string;
  comments: Comment[];
  brand: Brand | string; // Can be either Brand object or brand ID string
  createdAt: string;
  updatedAt: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// App Metadata
export interface AppMetadata {
  version: string;
  lastUpdated: string;
  updatedBy: string;
}

// Current app metadata
export const APP_METADATA: AppMetadata = {
  version: "1.0.0",
  lastUpdated: "2025-03-10 05:07:28",
  updatedBy: "lkbaonhatcontinue",
};
