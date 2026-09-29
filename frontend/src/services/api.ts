import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipCache?: boolean;
    ttlMs?: number;
  }
}

// Resolve API base URL:
// 1. Read import.meta.env.VITE_API_URL (e.g. from Vercel environment variables)
// 2. Fall back to local development server 'http://localhost:5000'
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').trim();

// Strip any trailing slashes
const normalizedBase = rawUrl.replace(/\/+$/, '');

// Ensure /api is appended if not already present, as all Express routes are mounted under /api
export const API_BASE_URL = normalizedBase.endsWith('/api')
  ? normalizedBase
  : `${normalizedBase}/api`;

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ClientDataCache {
  private cache = new Map<string, CacheEntry>();
  private inFlight = new Map<string, Promise<any>>();
  private defaultTTL = 120 * 1000; // 2 minutes active TTL

  private buildKey(url: string, params?: any): string {
    const cleanUrl = url.replace(/^\/+/, '');
    if (!params || Object.keys(params).length === 0) {
      return cleanUrl;
    }
    const sortedKeys = Object.keys(params).sort();
    const query = sortedKeys
      .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .map((k) => `${k}=${encodeURIComponent(String(params[k]))}`)
      .join('&');
    return query ? `${cleanUrl}?${query}` : cleanUrl;
  }

  private readStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = sessionStorage.getItem(`cf_cache_${key}`) || localStorage.getItem(`cf_cache_${key}`);
      if (!stored) return null;
      const entry: CacheEntry<T> = JSON.parse(stored);
      // Allow data up to 10 minutes old as stale cache for immediate render
      if (Date.now() - entry.timestamp < 10 * 60 * 1000) {
        this.cache.set(key, entry);
        return entry.data;
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  }

  private writeStorage<T>(key: string, entry: CacheEntry<T>): void {
    if (typeof window === 'undefined') return;
    try {
      const serialized = JSON.stringify(entry);
      sessionStorage.setItem(`cf_cache_${key}`, serialized);
      localStorage.setItem(`cf_cache_${key}`, serialized);
    } catch {
      // Ignore quota errors
    }
  }

  get<T>(url: string, params?: any): T | null {
    const key = this.buildKey(url, params);
    let entry = this.cache.get(key);
    if (!entry) {
      const fromStorage = this.readStorage<T>(key);
      if (fromStorage !== null) return fromStorage;
      return null;
    }
    // Return stale data up to 10 minutes to allow instant UI render
    if (Date.now() - entry.timestamp > 10 * 60 * 1000) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(url: string, params: any, data: T, ttlMs: number = this.defaultTTL): void {
    const key = this.buildKey(url, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };
    this.cache.set(key, entry);
    this.writeStorage(key, entry);
  }

  has(url: string, params?: any): boolean {
    return this.get(url, params) !== null;
  }

  invalidate(pattern?: string | RegExp): void {
    if (!pattern) {
      this.cache.clear();
      if (typeof window !== 'undefined') {
        try {
          Object.keys(sessionStorage).forEach((k) => {
            if (k.startsWith('cf_cache_')) sessionStorage.removeItem(k);
          });
          Object.keys(localStorage).forEach((k) => {
            if (k.startsWith('cf_cache_')) localStorage.removeItem(k);
          });
        } catch {}
      }
      return;
    }
    for (const key of Array.from(this.cache.keys())) {
      if (typeof pattern === 'string' ? key.includes(pattern) : pattern.test(key)) {
        this.cache.delete(key);
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.removeItem(`cf_cache_${key}`);
            localStorage.removeItem(`cf_cache_${key}`);
          } catch {}
        }
      }
    }
  }

  getInFlight(key: string): Promise<any> | undefined {
    return this.inFlight.get(key);
  }

  setInFlight(key: string, promise: Promise<any>): void {
    this.inFlight.set(key, promise);
  }

  deleteInFlight(key: string): void {
    this.inFlight.delete(key);
  }

  getKey(url: string, params?: any): string {
    return this.buildKey(url, params);
  }
}

export const clientCache = new ClientDataCache();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Intercept GET requests for cache lookups and in-flight request deduplication
const originalGet = api.get.bind(api);

(api as any).get = function <T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config?: AxiosRequestConfig<D>
): Promise<R> {
  const skipCache = config?.skipCache === true;
  const ttlMs = config?.ttlMs;
  const params = config?.params;
  const cacheKey = clientCache.getKey(url, params);

  // 1. If not skipping cache and we have fresh cached data, return immediately
  if (!skipCache) {
    const cachedData = clientCache.get<T>(url, params);
    if (cachedData !== null) {
      return Promise.resolve({
        data: cachedData,
        status: 200,
        statusText: 'OK (Client Cached)',
        headers: {},
        config: (config || {}) as any,
      } as unknown as R);
    }

    // 2. Deduplicate in-flight requests for the exact same key
    const existingInFlight = clientCache.getInFlight(cacheKey);
    if (existingInFlight) {
      return existingInFlight as unknown as Promise<R>;
    }
  }

  // 3. Perform network request
  const requestPromise = (originalGet as any)(url, config)
    .then((response: any) => {
      // Store successful responses in client cache
      if (response && response.data !== undefined) {
        clientCache.set(url, params, response.data, ttlMs);
      }
      return response;
    })
    .finally(() => {
      clientCache.deleteInFlight(cacheKey);
    });

  if (!skipCache) {
    clientCache.setInFlight(cacheKey, requestPromise);
  }

  return requestPromise as unknown as Promise<R>;
};

// Auto-invalidation on any mutation (POST, PATCH, PUT, DELETE)
const handleMutationInvalidation = (url?: string) => {
  if (!url) return;
  const lowerUrl = url.toLowerCase();

  // If AI command or automated orchestrator ran, invalidate all operational data
  if (lowerUrl.includes('ai') || lowerUrl.includes('command') || lowerUrl.includes('workflow')) {
    clientCache.invalidate();
    return;
  }

  // Targeted invalidation based on entity
  if (lowerUrl.includes('patient')) {
    clientCache.invalidate('patient');
    clientCache.invalidate('bed');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('bed')) {
    clientCache.invalidate('bed');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('doctor')) {
    clientCache.invalidate('doctor');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('inventory')) {
    clientCache.invalidate('inventory');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('ambulance')) {
    clientCache.invalidate('ambulance');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('appointment')) {
    clientCache.invalidate('appointment');
    clientCache.invalidate('doctor');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('task')) {
    clientCache.invalidate('task');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else if (lowerUrl.includes('approval')) {
    clientCache.invalidate('approval');
    clientCache.invalidate('task');
    clientCache.invalidate('inventory');
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  } else {
    // General fallback: invalidate analytics & activity
    clientCache.invalidate('analytics');
    clientCache.invalidate('activity');
  }
};

api.interceptors.response.use(
  (response) => {
    // If the request was a mutation, automatically purge related cache
    const method = response.config.method?.toUpperCase();
    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method || '')) {
      handleMutationInvalidation(response.config.url);
    }
    return response;
  },
  (error) => {
    let message = 'An unexpected error occurred';
    if (!error.response) {
      // Backend not running or unreachable
      message = `Backend service unavailable. Check that the CareFlow API server is reachable at ${API_BASE_URL}.`;
    } else if (error.response.status === 503) {
      message = error.response.data?.message || 'Service temporarily unavailable. AI or backend resource busy.';
    } else if (error.response.status === 502) {
      message = 'Upstream service gateway error. Check remote API connectivity.';
    } else if (error.response.status === 404) {
      message = error.response.data?.message || 'Requested operational endpoint or resource not found.';
    } else if (error.response.data?.error) {
      message = error.response.data.error;
    } else if (error.response.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Pre-warm backend (non-blocking ping to wake up Render if in cold sleep)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    originalGet('/health', { timeout: 8000 }).catch(() => {
      // Ignore background warmup ping failure
    });
  }, 100);
}
