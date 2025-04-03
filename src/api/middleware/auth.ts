import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60,
});

export async function validateApiKey(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const apiKey = req.header('X-API-Key');
    
    try {
        await rateLimiter.consume(req.ip);
        if (!apiKey || apiKey !== process.env.API_KEY) {
            res.status(401).json({ error: 'Invalid API key' });
            return;
        }
        next();
    } catch {
        res.status(429).json({ error: 'Too many requests' });
    }
}
