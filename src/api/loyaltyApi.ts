import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

// Use relative URL for API calls - Vite proxy will handle the backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    lastName: string;
    firstName: string;
    id: string;
    name: string;
    email: string;
  };
}

export interface EarnPointsRequest {
  points: number;
  description?: string;
}

export interface RedeemPointsRequest {
  points: number;
  description?: string;
}

export interface BalanceResponse {
  points: number;
  balance: number;
  loyaltyAccountId: string;
}

export interface TransactionHistory {
  id: string;
  type: 'earn' | 'redeem';
  points: number;
  description: string;
  createdAt: string;
}

export interface HistoryResponse {
  transactions: TransactionHistory[];
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Create axios instance
const loyaltyApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
loyaltyApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
loyaltyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AxiosResponse<LoginResponse>> => {
    try {
        const response = await loyaltyApi.post('/auth/login', credentials);
        return response;
    } catch (error) {
        console.error('Login API error:', error);
        throw error;
    }
};

/**
 * Earn points for user
 */
export const earnPoints = async (data: EarnPointsRequest): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await loyaltyApi.post('/loyalty/earn', data);
    return response;
  } catch (error) {
    console.error('Earn points API error:', error);
    throw error;
  }
};

/**
 * Redeem points for user
 */
export const redeemPoints = async (data: RedeemPointsRequest): Promise<AxiosResponse<ApiResponse>> => {
  try {
    const response = await loyaltyApi.post('/redeem', data);
    return response;
  } catch (error) {
    console.error('Redeem points API error:', error);
    throw error;
  }
};

/**
 * Get user's current balance
 */
export const getBalance = async (): Promise<AxiosResponse<BalanceResponse>> => {
  try {
    const response = await loyaltyApi.get('loyalty/balance');
    return response;
  } catch (error) {
    console.error('Get balance API error:', error);
    throw error;
  }
};

/**
 * Get user's transaction history
 */
export const getHistory = async (): Promise<AxiosResponse<HistoryResponse>> => {
  try {
    const response = await loyaltyApi.get('loyalty/history');
    return response;
  } catch (error) {
    console.error('Get history API error:', error);
    throw error;
  }
};

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      return error.response.data?.message || 'An error occurred';
    } else if (error.request) {
      // Request was made but no response received
      return 'Network error. Please check your connection.';
    }
  }
  // Something else happened
  return 'An unexpected error occurred';
};

export default loyaltyApi;
