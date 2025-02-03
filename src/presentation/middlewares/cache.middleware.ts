// src/presentation/middlewares/cache.middleware.ts
import { Request, Response, NextFunction } from "express";
import { CacheService } from "src/infrastructure/persistence/redis/cache.service";

export const createCacheMiddleware = (cacheService: CacheService) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") {
      return next();
    }

    const cacheKey = req.originalUrl;
    const cachedData = await cacheService.get(cacheKey);

    if (cachedData) {
      return res.json(cachedData);
    }

    next();
  };
};
