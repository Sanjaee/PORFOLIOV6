import { NextRequest, NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store untuk rate limiting
// Note: Untuk production dengan multiple instances, gunakan Redis atau database
const rateLimitStore: RateLimitStore = {};

// Cleanup old entries setiap 1 menit
setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach((key) => {
    if (rateLimitStore[key].resetTime < now) {
      delete rateLimitStore[key];
    }
  });
}, 60000); // Cleanup setiap 1 menit

/**
 * Get client IP address from request
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for IP address
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip"); // Cloudflare
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(",")[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to a default if no IP is found
  return "unknown";
}

/**
 * Rate limiting middleware
 * @param request - Next.js request object
 * @param maxRequests - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns NextResponse with error if rate limit exceeded, null otherwise
 */
export function rateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000 // Default: 100 requests per minute
): NextResponse | null {
  const clientIP = getClientIP(request);
  
  if (clientIP === "unknown") {
    // If we can't determine IP, allow the request but log it
    console.warn("Could not determine client IP for rate limiting");
    return null;
  }
  
  const now = Date.now();
  const key = clientIP;
  
  // Check if IP exists in store
  if (!rateLimitStore[key] || rateLimitStore[key].resetTime < now) {
    // First request or window expired, reset
    rateLimitStore[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return null; // Allow request
  }
  
  // Increment count
  rateLimitStore[key].count++;
  
  // Check if limit exceeded
  if (rateLimitStore[key].count > maxRequests) {
    const retryAfter = Math.ceil((rateLimitStore[key].resetTime - now) / 1000);
    const hours = Math.floor(retryAfter / 3600);
    const minutes = Math.floor((retryAfter % 3600) / 60);
    const seconds = retryAfter % 60;
    
    let timeMessage = "";
    if (hours > 0) {
      timeMessage = `${hours} jam ${minutes > 0 ? `${minutes} menit` : ""}`.trim();
    } else if (minutes > 0) {
      timeMessage = `${minutes} menit ${seconds > 0 ? `${seconds} detik` : ""}`.trim();
    } else {
      timeMessage = `${seconds} detik`;
    }
    
    return NextResponse.json(
      {
        error: "Terlalu banyak permintaan",
        message: `Maaf, Anda telah mencapai batas penggunaan harian. Silakan coba lagi dalam ${timeMessage}.`,
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": new Date(rateLimitStore[key].resetTime).toISOString(),
        },
      }
    );
  }
  
  // Add rate limit headers to response
  const remaining = maxRequests - rateLimitStore[key].count;
  const resetTime = rateLimitStore[key].resetTime;
  
  // Return null to allow request, but we'll add headers in the route handler
  return null;
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000
): Record<string, string> {
  const clientIP = getClientIP(request);
  const key = clientIP;
  
  if (!rateLimitStore[key]) {
    return {
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": maxRequests.toString(),
      "X-RateLimit-Reset": new Date(Date.now() + windowMs).toISOString(),
    };
  }
  
  const remaining = Math.max(0, maxRequests - rateLimitStore[key].count);
  const resetTime = rateLimitStore[key].resetTime;
  
  return {
    "X-RateLimit-Limit": maxRequests.toString(),
    "X-RateLimit-Remaining": remaining.toString(),
    "X-RateLimit-Reset": new Date(resetTime).toISOString(),
  };
}
