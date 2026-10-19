function getApiBase(): string {
  const origin = (import.meta as any).env?.VITE_API_ORIGIN;
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  // If VITE_API_BASE_URL is explicitly set to an absolute URL
  if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
    return baseUrl.trim().replace(/\/+$/, '');
  }

  // If VITE_API_ORIGIN is specified and not pointing to localhost
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
    let cleanOrigin = origin.trim().replace(/\/+$/, '');
    if (!cleanOrigin.startsWith('http://') && !cleanOrigin.startsWith('https://')) {
      cleanOrigin = `https://${cleanOrigin}`;
    }
    return `${cleanOrigin}/api/v1`;
  }

  // Production fallback: reliably communicate with the live backend API
  return 'https://gyde-api.vercel.app/api/v1';
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

export const TOKEN_STORAGE_KEY = 'gyde_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {}
}

export function removeStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {}
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Client-App': 'web',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Send HTTP-only session cookie if available
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError('Unable to connect to GYDE server. Please check your network connection.', 0);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    removeStoredToken();
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data?.errors);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}
