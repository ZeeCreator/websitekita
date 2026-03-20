# 🔒 Security Documentation - WebsiteKita

## Security Features Implemented

### 1. **Input Validation & Sanitization**

#### Composables:
- `useSecurity.ts` - Core security utilities
- `useValidation.ts` - Input validation composable

#### Protections:
✅ **XSS Prevention**
- HTML sanitization using `sanitizeHTML()`
- URL sanitization to prevent `javascript:` protocol
- Attack pattern detection

✅ **SQL Injection Prevention**
- Input escaping with `escapeSQL()`
- Parameterized queries via PocketBase ORM

✅ **Path Traversal Prevention**
- File name sanitization
- Directory traversal pattern detection

### 2. **Authentication Security**

✅ **Password Security**
- Minimum 8 characters
- Requires uppercase, lowercase, number, special character
- Client-side hashing with SHA-256 (additional layer)
- Secure password storage via PocketBase

✅ **CSRF Protection**
- Token generation with `generateCSRFToken()`
- Constant-time comparison with `validateCSRFToken()`
- Token included in all API requests

✅ **Session Security**
- Secure session management via PocketBase
- Automatic token refresh
- Session timeout handling

### 3. **Rate Limiting**

✅ **Request Throttling**
- 100 requests per minute per identifier
- In-memory store with automatic cleanup
- Configurable limits per endpoint

```typescript
checkRateLimit(identifier, maxRequests, windowMs)
```

### 4. **File Upload Security**

✅ **File Type Validation**
- Whitelist: `['image/jpeg', 'image/png', 'image/gif', 'image/webp']`
- Extension validation
- MIME type verification

✅ **File Size Limits**
- Maximum 5MB per file
- Validation before upload

✅ **File Name Sanitization**
- Remove special characters
- Prevent path traversal

### 5. **Content Security Policy (CSP)**

```javascript
default-src 'self'
script-src 'self' 'unsafe-inline' https://websitekita-1.disqus.com
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
font-src 'self' data:
connect-src 'self' https://api.whatsapp.com
frame-src 'self' https://disqus.com
```

### 6. **Security Headers**

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` | Restrict features |

### 7. **Input Validation Rules**

#### User Registration:
- Username: 3-50 chars, alphanumeric + dots + underscores
- Email: Valid format with regex validation
- Password: Strong password requirements

#### Products:
- Title: 1-255 chars, sanitized
- Description: Max 2000 chars, sanitized
- Price: Positive number only
- Stock: Non-negative number

#### Links:
- Title: 1-100 chars, sanitized
- URL: Valid URL format, sanitized
- Order: Non-negative number

#### Custom Fields:
- Name: Alphanumeric + underscores, sanitized
- Label: 1-100 chars, sanitized
- Type: Whitelist only

### 8. **Attack Detection**

Patterns detected and blocked:
- ❌ XSS scripts (`<script>`, `javascript:`, `on*=`)
- ❌ SQL injection (`SELECT`, `INSERT`, `DELETE`, `DROP`, `UNION`)
- ❌ Path traversal (`../`, `%2e%2e%2f`)
- ❌ Code injection (`<?php`, `eval()`)

### 9. **Error Handling**

✅ **Secure Error Messages**
- Generic error messages for users
- Detailed logs for developers
- No stack traces exposed to clients

✅ **Error Logging**
- Console monitoring
- Unhandled rejection tracking
- Security violation alerts

### 10. **Client-Side Security**

✅ **Anti-Debugging**
- Console protection in production
- Debugger detection

✅ **Secure Token Generation**
- Cryptographically secure random tokens
- 32-character minimum length

## Security Best Practices

### For Developers:

1. **Always validate input**
   ```typescript
   const { validateProductForm } = useValidation();
   if (!validateProductForm(form)) return;
   ```

2. **Sanitize all user input**
   ```typescript
   const sanitized = sanitizeHTML(userInput);
   ```

3. **Use CSRF tokens**
   ```typescript
   const token = useNuxtApp().$security.getToken();
   ```

4. **Validate files before upload**
   ```typescript
   if (!isValidFileType(file.name, ['jpg', 'png'])) return;
   if (!isValidFileSize(file.size, 5 * 1024 * 1024)) return;
   ```

5. **Check rate limits**
   ```typescript
   const { allowed } = checkRateLimit(userId);
   if (!allowed) return;
   ```

### For Production:

1. **Enable HTTPS only**
2. **Set secure cookies**
3. **Use environment variables for secrets**
4. **Regular security audits**
5. **Keep dependencies updated**
6. **Monitor for suspicious activity**
7. **Implement logging and alerting**

## Security Checklist

- [x] Input validation on all forms
- [x] XSS protection
- [x] CSRF protection
- [x] Rate limiting
- [x] File upload validation
- [x] SQL injection prevention
- [x] Security headers
- [x] Content Security Policy
- [x] Password strength validation
- [x] Secure token generation
- [x] Error handling without information leakage
- [x] Attack pattern detection
- [x] Session security
- [x] URL sanitization

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. Do not disclose publicly until fixed
2. Send details to security@websitekita.id
3. Allow reasonable time for patching

## Security Updates

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-01 | Initial security implementation |

---

**Last Updated:** January 2024
**Maintained by:** WebsiteKita Security Team
