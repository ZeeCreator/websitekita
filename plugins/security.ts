/**
 * Security Plugin
 * - Apply security headers
 * - Setup CSRF protection
 * - Initialize security monitoring
 */

import { getCSPHeaders, generateCSRFToken, cleanRateLimitStore } from '../composables/useSecurity';

export default defineNuxtPlugin(() => {
  // Store CSRF token in state
  const csrfToken = useState<string>('csrfToken', () => generateCSRFToken());

  // Apply security headers on client side (for API calls)
  const applySecurityHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'X-CSRF-Token': csrfToken.value,
      'X-Requested-With': 'XMLHttpRequest',
    };

    return headers;
  };

  // Clean rate limit store periodically (every 5 minutes)
  if (process.client) {
    setInterval(() => {
      cleanRateLimitStore();
    }, 5 * 60 * 1000);
  }

  // Monitor for security violations
  const monitorSecurity = () => {
    if (process.client) {
      // Monitor for XSS attempts
      window.addEventListener('error', (event) => {
        if (event.message.includes('script') || event.message.includes('eval')) {
          console.warn('Potential XSS attempt detected:', event);
          // In production, send to monitoring service
        }
      });

      // Monitor for unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        console.warn('Unhandled promise rejection:', event.reason);
        // In production, send to monitoring service
      });

      // Prevent console enumeration (basic anti-debugging)
      let prev: any;
      try {
        const descriptor = Object.getOwnPropertyDescriptor(console, 'log');
        prev = descriptor?.get;
      } catch (e) {
        // Ignore
      }

      Object.defineProperty(console, 'log', {
        get: function () {
          const caller = new Error().stack?.split('\n')[2];
          if (caller && caller.includes('debugger')) {
            return () => {};
          }
          return prev ? prev() : () => {};
        },
        configurable: true,
      });
    }
  };

  // Initialize security monitoring
  monitorSecurity();

  // Provide security utilities
  return {
    provide: {
      security: {
        getHeaders: applySecurityHeaders,
        getToken: () => csrfToken.value,
        refreshToken: () => {
          csrfToken.value = generateCSRFToken();
        },
      },
    },
  };
});
