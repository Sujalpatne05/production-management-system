import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '@/config/apiConfig';

export interface User {
  id: string;
  email: string;
  fullName: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  roles?: {
    roleId: number;
    role: {
      id: number;
      name: string;
    };
    tenant: {
      id: string;
      name: string;
    };
  }[];
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface UpdateUserRequest {
  email?: string;
  fullName?: string;
  password?: string;
}

export interface AssignRoleRequest {
  userId: string;
  roleId: number;
  tenantId: string;
}

export class UserService {
  static async getAll(): Promise<User[]> {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS.LIST);
  }

  static async getById(id: string): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.GET.replace(':id', id));
  }

  static async create(data: CreateUserRequest): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.CREATE, data);
  }

  static async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE.replace(':id', id), data);
  }

  static async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE.replace(':id', id));
  }

  static async assignRole(data: AssignRoleRequest): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.USERS.ASSIGN_ROLES, data);
  }
}
