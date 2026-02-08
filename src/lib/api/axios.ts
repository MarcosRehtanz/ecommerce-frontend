import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES, loginWithRedirectRoute } from '@/lib/routes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Error codes for auth-related errors
export const AUTH_ERROR_CODES = {
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_INVALID: 'SESSION_INVALID',
} as const;

// Helper to extract error info from API response
interface ApiErrorResponse {
  message?: string | string[];
  errorCode?: string;
  statusCode?: number;
}

function getErrorInfo(error: AxiosError): { message: string; code?: string } {
  const data = error.response?.data as ApiErrorResponse | undefined;
  const message = data?.message
    ? (Array.isArray(data.message) ? data.message[0] : data.message)
    : error.message || 'Error de conexión';

  return {
    message,
    code: data?.errorCode,
  };
}

// Check if error is due to expired token (should attempt refresh)
function isTokenExpiredError(error: AxiosError): boolean {
  const data = error.response?.data as ApiErrorResponse | undefined;

  // Check for explicit error code
  if (data?.errorCode === AUTH_ERROR_CODES.TOKEN_EXPIRED) {
    return true;
  }

  // Check message for expiration indicators
  const message = data?.message;
  if (typeof message === 'string') {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('expirado') ||
           lowerMessage.includes('expired') ||
           lowerMessage.includes('jwt expired');
  }

  return false;
}

// Check if this is an auth endpoint that shouldn't trigger refresh
function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  return url.includes('/auth/login') ||
         url.includes('/auth/register') ||
         url.includes('/auth/refresh');
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add access token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const { message, code } = getErrorInfo(error);

    // Skip refresh logic for auth endpoints
    if (isAuthEndpoint(originalRequest.url)) {
      const enhancedError = new Error(message);
      (enhancedError as any).code = code;
      return Promise.reject(enhancedError);
    }

    // Only attempt refresh for 401 errors that indicate token expiration
    const shouldRefresh = error.response?.status === 401 &&
                          !originalRequest._retry &&
                          (isTokenExpiredError(error) || !code); // If no code, assume it might be expired

    if (shouldRefresh) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: Error) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().updateTokens(accessToken, newRefreshToken);

          processQueue(null, accessToken);
          isRefreshing = false;

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(new Error('Session expired'), null);
          isRefreshing = false;

          // Refresh failed, logout user
          useAuthStore.getState().logout();
          if (typeof window !== 'undefined') {
            window.location.href = `${ROUTES.auth.login}?session=expired`;
          }

          const sessionError = new Error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          (sessionError as any).code = AUTH_ERROR_CODES.SESSION_INVALID;
          return Promise.reject(sessionError);
        }
      } else {
        isRefreshing = false;
        // No refresh token, logout
        useAuthStore.getState().logout();
        if (typeof window !== 'undefined') {
          window.location.href = ROUTES.auth.login;
        }
      }
    }

    // For other errors (not token expiration), just pass through
    const enhancedError = new Error(message);
    (enhancedError as any).code = code;
    (enhancedError as any).status = error.response?.status;
    return Promise.reject(enhancedError);
  }
);

export default api;
