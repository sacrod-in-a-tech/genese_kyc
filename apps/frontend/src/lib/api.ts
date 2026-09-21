const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? response.statusText);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: string | null;
  createdBy: string | null;
  createdDate: string;
  lastUpdatedBy: string | null;
  lastUpdatedDate: string;
}

export const api = {
  login: (username: string, password: string) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  register: (payload: {
    username: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth?: string;
  }) => request<User>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  getUsers: (token: string) => request<User[]>('/users', {}, token),

  getUser: (id: string, token: string) => request<User>(`/users/${id}`, {}, token),

  createUser: (
    payload: {
      username: string;
      password: string;
      firstName: string;
      middleName?: string;
      lastName: string;
      dateOfBirth?: string;
    },
    token: string,
  ) => request<User>('/users', { method: 'POST', body: JSON.stringify(payload) }, token),

  updateUser: (
    id: string,
    payload: {
      firstName?: string;
      middleName?: string;
      lastName?: string;
      dateOfBirth?: string;
    },
    token: string,
  ) => request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }, token),

  deleteUser: (id: string, token: string) => request<void>(`/users/${id}`, { method: 'DELETE' }, token),

  changePassword: (currentPassword: string, newPassword: string, token: string) =>
    request<void>(
      '/auth/change-password',
      { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) },
      token,
    ),
};
