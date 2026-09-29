import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  body: any;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();
const DEFAULT_TTL = 30 * 1000; // 30 seconds TTL

export const routeCache = (ttlMs: number = DEFAULT_TTL) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip health check from cache
    if (req.path === '/health' || req.originalUrl?.includes('/health')) {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cached = memoryCache.get(key);

    if (cached && Date.now() - cached.timestamp < ttlMs) {
      res.setHeader('X-CareFlow-Cache', 'HIT');
      return res.json(cached.body);
    }

    // Intercept res.json to store response in memory
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, { body, timestamp: Date.now() });
      }
      res.setHeader('X-CareFlow-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
};

export const invalidateRouteCache = (pattern?: string) => {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of Array.from(memoryCache.keys())) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
};
