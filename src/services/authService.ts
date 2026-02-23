import { API_BASE_URL } from '../config/api';

export type ApiRole = 'Instructor' | 'Student';

export type UiRole = 'instructor' | 'student' | 'educator';

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: ApiRole;
  phoneNumber?: string | null;
}

export interface AuthUser {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string | null;
  profilePicture: string | null;
  lastLogin: string | null;
  createdAt: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = RegisterResponse;

export interface RefreshRequest {
  refreshToken: string;
}

export type RefreshResponse = RegisterResponse;

export function mapUiRoleToApi(role: UiRole | string): ApiRole {
  const lower = role.toLowerCase();
  if (lower === 'educator' || lower === 'instructor') {
    return 'Instructor';
  }
  return 'Student';
}

export function mapApiRoleToUi(role: string): 'instructor' | 'student' {
  const lower = role.toLowerCase();
  return lower === 'instructor' ? 'instructor' : 'student';
}

function persistAuth(response: RegisterResponse) {
  const uiRole = mapApiRoleToUi(response.user.role);

  localStorage.setItem('authToken', response.token);
  localStorage.setItem('authRefreshToken', response.refreshToken);
  localStorage.setItem('authExpiresAt', response.expiresAt);
  localStorage.setItem('authUser', JSON.stringify(response.user));
  localStorage.setItem('userRole', uiRole);
}

async function handleError(response: Response): Promise<never> {
  let message = 'Request failed. Please try again.';

  try {
    const data = await response.json();
    if (typeof data === 'string') {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.errors) {
      if (typeof data.errors === 'string') {
        message = data.errors;
      } else {
        const allErrors = Object.values(data.errors).flat() as unknown[];
        const firstError = allErrors[0];
        if (typeof firstError === 'string') {
          message = firstError;
        }
      }
    }
  } catch {
    // ignore JSON parse errors and use default message
  }

  throw new Error(message);
}

export async function register(input: RegisterRequest): Promise<RegisterResponse> {
  const body = {
    email: input.email,
    password: input.password,
    fullName: input.fullName,
    role: input.role,
    phoneNumber: input.phoneNumber ?? null,
  };

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await handleError(response);
  }

  const data = (await response.json()) as RegisterResponse;
  persistAuth(data);
  return data;
}

export async function login(input: LoginRequest): Promise<LoginResponse> {
  const body = {
    email: input.email,
    password: input.password,
  };

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await handleError(response);
  }

  const data = (await response.json()) as RegisterResponse;
  persistAuth(data);
  return data;
}

export async function refreshToken(): Promise<RefreshResponse> {
  const refreshTokenValue = localStorage.getItem('authRefreshToken');
  if (!refreshTokenValue) {
    throw new Error('No refresh token available.');
  }

  const body: RefreshRequest = {
    refreshToken: refreshTokenValue,
  };

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    await handleError(response);
  }

  const data = (await response.json()) as RefreshResponse;
  persistAuth(data);
  return data;
}

