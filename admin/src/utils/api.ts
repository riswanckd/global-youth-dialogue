function getApiBase(): string {
  // If running in production (on vercel.app or custom domain), strictly use the active live GYDE API
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    return 'https://gyde-api.vercel.app/api/v1';
  }

  const origin = (import.meta as any).env?.VITE_API_ORIGIN;
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL;

  // If VITE_API_BASE_URL is explicitly set to an absolute URL
  if (baseUrl && (baseUrl.startsWith('http://') || baseUrl.startsWith('https://'))) {
    return baseUrl.trim().replace(/\/+$/, '');
  }

  // If VITE_API_ORIGIN is specified and not pointing to localhost or stale deployments
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('global-youth-dialogue-api')) {
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

export function getAdminTokenForRequest(): string | null {
  const token = getStoredAdminToken();
  if (token && token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          return token;
        }
      }
    } catch {}
  }
  return null;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const separator = endpoint.includes('?') ? '&' : '?';
  const cacheBuster = isGet ? `${separator}_t=${Date.now()}` : '';
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}${cacheBuster}`;

  const token = getAdminTokenForRequest();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-client-app': 'admin',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  const config: RequestInit = {
    cache: 'no-store',
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
