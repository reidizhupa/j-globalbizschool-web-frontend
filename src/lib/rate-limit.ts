import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Example: 5 requests per hour per IP
export const limiter = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(5, "1m"),
	analytics: false,
});
