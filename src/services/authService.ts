import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    roles?: {
      roleId: number;
      role: string;
      tenant: {
        id: string;
        name: string;
      };
      permissions: string[];
    }[];
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      const defaultTenant = response.user?.roles?.[0]?.tenant;
      if (defaultTenant) {
        localStorage.setItem('tenant', JSON.stringify(defaultTenant));
      }
    }
    return response;
  }

  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      const defaultTenant = response.user?.roles?.[0]?.tenant;
      if (defaultTenant) {
        localStorage.setItem('tenant', JSON.stringify(defaultTenant));
      }
    }
    return response;
  }

  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
    }
    return response;
  }

  static logout(): void {
    apiClient.clearToken();
    localStorage.removeItem('user');
    localStorage.removeItem('tenant');
  }

  static getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
