/**
 * Production Error Handler
 * - Silences dev-only warnings in production
 * - Handles uncaught errors gracefully
 */

export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'production' && process.client) {
    // Suppress Vue warnings in production
    const app = useNuxtApp();

    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      // Prevent default error handling
      event.preventDefault();

      // Log to monitoring service in production (implement your own)
      // Example: sendToMonitoringService(event.error);

      // Silently continue - don't break UX
      return true;
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      // Prevent default handling
      event.preventDefault();

      // Log to monitoring service in production
      // Example: sendToMonitoringService(event.reason);

      // Silently continue
      return true;
    });

    // Suppress console warnings in production (optional)
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args: any[]) => {
      // Filter out Vue/Suspense warnings
      if (args[0]?.includes?.('Suspense') || args[0]?.includes?.('experimental')) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = (...args: any[]) => {
      // Filter out hydration mismatch warnings that are handled
      if (args[0]?.includes?.('Hydration') && args[0]?.includes?.('mismatch')) {
        return;
      }
      originalError.apply(console, args);
    };
  }
});
