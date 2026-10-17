function getApiBase(): string {
  const origin = (import.meta as any).env?.VITE_API_ORIGIN;
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  // If VITE_API_ORIGIN is specified from .env or Vercel (e.g. global-youth-dialogue-api.vercel.app)
  if (origin && origin !== 'http://localhost:5000') {
    let cleanOrigin = origin.trim().replace(/\/+$/, '');
    if (!cleanOrigin.startsWith('http://') && !cleanOrigin.startsWith('https://')) {
      cleanOrigin = `https://${cleanOrigin}`;
    }
    return `${cleanOrigin}/api/v1`;
  }

  // If VITE_API_BASE_URL is explicitly set to an absolute URL
  if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
    return baseUrl.trim().replace(/\/+$/, '');
  }

  // In local dev with localhost:5000, use Vite proxy /api/v1
  if ((import.meta as any).env?.DEV) {
    return baseUrl || '/api/v1';
  }

  if (origin) {
    let cleanOrigin = origin.trim().replace(/\/+$/, '');
    if (!cleanOrigin.startsWith('http://') && !cleanOrigin.startsWith('https://')) {
      cleanOrigin = `https://${cleanOrigin}`;
    }
    return `${cleanOrigin}/api/v1`;
  }

  return baseUrl || '/api/v1';
}

export const API_BASE = getApiBase();

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const ADMIN_TOKEN_KEY = 'gyde_admin_token';

export function getStoredAdminToken(): string | null {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {}
}

export function removeStoredAdminToken(): void {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getStoredAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-client-app': 'admin',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError('Unable to connect to GYDE API server.', 0);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    removeStoredAdminToken();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data?.errors);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}
