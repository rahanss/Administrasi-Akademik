// Rate Limiting Middleware
// Mencegah abuse dan brute force attack
// Mengikuti prinsip security: limit request per IP

// Simple in-memory rate limiter (untuk production, gunakan Redis)
const rateLimitStore = new Map();

/**
 * Rate limiter middleware
 * @param {object} options - { windowMs: number, max: number, message: string }
 * @returns {function} Express middleware
 */
const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 menit default
    max = 100, // 100 requests per window default
    message = 'Terlalu banyak request. Silakan coba lagi nanti.'
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Cleanup old entries (setiap 5 menit)
    if (Math.random() < 0.01) { // 1% chance untuk cleanup
      for (const [key, value] of rateLimitStore.entries()) {
        if (now - value.resetTime > windowMs) {
          rateLimitStore.delete(key);
        }
      }
    }
    
    // Get atau create rate limit data untuk IP ini
    let rateLimitData = rateLimitStore.get(ip);
    
    if (!rateLimitData || now - rateLimitData.resetTime > windowMs) {
      // Reset atau create new
      rateLimitData = {
        count: 0,
        resetTime: now
      };
    }
    
    // Increment count
    rateLimitData.count++;
    rateLimitStore.set(ip, rateLimitData);
    
    // Check limit
    if (rateLimitData.count > max) {
      const retryAfter = Math.ceil((rateLimitData.resetTime + windowMs - now) / 1000);
      return res.status(429).json({
        error: message,
        retryAfter: retryAfter
      });
    }
    
    // Set headers untuk info rate limit
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - rateLimitData.count),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime + windowMs).toISOString()
    });
    
    next();
  };
};

// Rate limiter khusus untuk login (lebih ketat)
const loginRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Hanya 5 percobaan login per 15 menit
  message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.'
});

// Rate limiter untuk API umum
const apiRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // 100 requests per 15 menit
  message: 'Terlalu banyak request. Silakan coba lagi nanti.'
});

module.exports = {
  rateLimiter,
  loginRateLimiter,
  apiRateLimiter
};
