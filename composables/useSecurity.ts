/**
 * Security Utilities for Production
 * - Input sanitization
 * - XSS protection
 * - CSRF token validation
 * - Rate limiting helper
 * - SQL injection prevention
 */

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (str: string): string => {
  if (!str) return '';
  
  // Client-side: use DOM for sanitization
  if (process.client && typeof document !== 'undefined') {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  // Server-side: basic sanitization
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Sanitize URL to prevent javascript: protocol
export const sanitizeURL = (url: string): string => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.match(/^javascript:/i)) {
    return '';
  }
  return trimmed;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indonesian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,11}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

// Sanitize file name to prevent path traversal
export const sanitizeFileName = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

// Validate file type by extension
export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(ext);
};

// Validate file size (in bytes)
export const isValidFileSize = (size: number, maxSize: number): boolean => {
  return size <= maxSize;
};

// Generate CSRF token
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate CSRF token (constant time comparison)
export const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  if (typeof token !== 'string' || typeof expectedToken !== 'string') {
    return false;
  }
  if (token.length !== expectedToken.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  return result === 0;
};

// Rate limiting store (in-memory, for production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Check rate limit
export const checkRateLimit = (
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } => {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime };
};

// Clean old rate limit records (call periodically)
export const cleanRateLimitStore = (): void => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
};

// Prevent SQL injection by escaping special characters
export const escapeSQL = (str: string): string => {
  return str.replace(/['"\\;]/g, (char) => {
    const escapeMap: Record<string, string> = {
      "'": "''",
      '"': '\\"',
      '\\': '\\\\',
      ';': '',
    };
    return escapeMap[char] || char;
  });
};

// Validate UUID format
export const isValidUUID = (str: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Validate alphanumeric with underscores
export const isValidAlphanumeric = (str: string, minLen: number = 1, maxLen: number = 50): boolean => {
  const regex = new RegExp(`^[a-zA-Z0-9_]{${minLen},${maxLen}}$`);
  return regex.test(str);
};

// Content Security Policy headers
export const getCSPHeaders = (): Record<string, string> => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://websitekita-1.disqus.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.whatsapp.com",
      "frame-src 'self' https://disqus.com",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
};

// Sanitize object recursively
export const sanitizeObject = (obj: any, depth: number = 0): any => {
  if (depth > 10) return obj; // Prevent infinite recursion
  
  if (typeof obj === 'string') {
    return sanitizeHTML(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[sanitizeHTML(key)] = sanitizeObject(value, depth + 1);
    }
    return sanitized;
  }
  
  return obj;
};

// Check for common attack patterns
export const detectAttackPattern = (input: string): { detected: boolean; type?: string } => {
  const patterns = [
    { regex: /<script[^>]*>/gi, type: 'XSS' },
    { regex: /javascript:/gi, type: 'XSS' },
    { regex: /on\w+\s*=/gi, type: 'XSS' },
    { regex: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/gi, type: 'SQL_INJECTION' },
    { regex: /\.\.\//g, type: 'PATH_TRAVERSAL' },
    { regex: /%2e%2e%2f/gi, type: 'PATH_TRAVERSAL' },
    { regex: /<\?php/gi, type: 'CODE_INJECTION' },
    { regex: /eval\(/gi, type: 'CODE_INJECTION' },
  ];

  for (const pattern of patterns) {
    if (pattern.regex.test(input)) {
      return { detected: true, type: pattern.type };
    }
  }

  return { detected: false };
};

// Secure random string generator
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => chars[byte % chars.length]).join('');
};

// Hash password (client-side, for additional security layer)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

// Validate password strength
export const isPasswordStrong = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { valid: errors.length === 0, errors };
};
