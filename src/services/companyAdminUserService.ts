import { apiClient } from './apiClient';

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

export interface CompanyUserListResponse {
  success: boolean;
  data: CompanyUser[];
  total: number;
  userCount: number;
  maxUsers: number;
  availableSlots: number;
  availableRoles?: string[];
  limit: number;
  offset: number;
}

const AVAILABLE_ROLES = [
  'CEO',
  'Finance Manager',
  'Sales Manager',
  'Procurement Manager',
  'Production Manager',
  'Quality Manager',
  'Warehouse Manager',
  'HR Manager',
  'System Administrator'
];

export class CompanyAdminUserService {
  static async getUsers(limit: number = 10, offset: number = 0): Promise<CompanyUserListResponse> {
    const response = await apiClient.get<CompanyUserListResponse>(
      `/company-admin/users?limit=${limit}&offset=${offset}`
    );
    return response;
  }

  static async createUser(data: CreateUserRequest): Promise<CompanyUser> {
    const response = await apiClient.post<CompanyUser>('/company-admin/users', data);
    return response;
  }

  static async updateUser(userId: string, data: UpdateUserRequest): Promise<CompanyUser> {
    const response = await apiClient.put<CompanyUser>(`/company-admin/users/${userId}`, data);
    return response;
  }

  static async deleteUser(userId: string): Promise<void> {
    await apiClient.delete<void>(`/company-admin/users/${userId}`);
  }

  static async getAvailableRoles(): Promise<string[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: string[] }>(
        '/company-admin/roles'
      );
      return response.data || AVAILABLE_ROLES;
    } catch (error) {
      console.warn('Failed to fetch roles from backend, using default roles', error);
      return AVAILABLE_ROLES;
    }
  }

  static getAvailableRolesSync(): string[] {
    return AVAILABLE_ROLES;
  }

  static getRolesExcludingSuperAdmin(): string[] {
    return AVAILABLE_ROLES.filter(role => role !== 'super_admin');
  }
}
