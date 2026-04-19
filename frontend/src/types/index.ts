// Kazakhstan cities for the application
export const KAZAKHSTAN_CITIES = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Актобе',
  'Караганда',
  'Тараз',
  'Павлодар',
  'Усть-Каменогорск',
  'Семей',
  'Атырау',
  'Костанай',
  'Уральск',
  'Петропавловск',
  'Актау',
  'Темиртау',
  'Кызылорда',
  'Экибастуз',
  'Рудный',
] as const;

export type KazakhstanCity = (typeof KAZAKHSTAN_CITIES)[number];

// Housing types
export type HousingType = 'room' | 'apartment' | 'house' | 'roommate';

// Lifestyle tags
export type LifestyleTag = 'student-friendly' | 'quiet' | 'social' | 'no-smoking' | 'pets-allowed';

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  city: KazakhstanCity;
  avatar?: string;
  bio?: string;
  phone?: string;
  createdAt: string;
}

// Listing type
export interface Listing {
  id: string;
  title: string;
  description: string;
  city: KazakhstanCity;
  price: number; // in KZT
  housingType: HousingType;
  capacity: number;
  tags: LifestyleTag[];
  images: string[];
  availableSpots: number;
  owner: User;
  createdAt: string;
  updatedAt: string;
}

// Interest status
export type InterestStatus = 'pending' | 'accepted' | 'rejected';

// Interest type
export interface Interest {
  id: string;
  listing: Listing;
  interestedUser: User;
  status: InterestStatus;
  createdAt: string;
}

// Search filters
export interface SearchFilters {
  city: string;
  keyword: string;
  housingType: HousingType | '';
  priceMin: number;
  priceMax: number;
  capacity: number;
  tags: LifestyleTag[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  city: KazakhstanCity;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form validation errors
export interface ValidationErrors {
  [key: string]: string;
}
