export default defineNuxtConfig({
  devtools: { enabled: false },

  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },

  modules: [
    '@pinia/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.NUXT_PUBLIC_POCKETBASE_URL || 'https://api.websitekita.biz.id/',
    },
  },

  // App configuration
  app: {
    head: {
      title: 'WebsiteKita - Multi-Store Marketplace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Platform link-in-bio untuk creator menjual produk digital' },
        { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: false,
    layoutTransition: false,
  },

  // Security module headers (server-side via HTTP headers)
  security: {
    headers: {
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", 'https://websitekita-1.disqus.com'],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:', 'blob:'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'", 'https://api.whatsapp.com'],
        'frame-src': ["'self'", 'https://disqus.com'],
      },
      crossOriginEmbedderPolicy: 'credentialless',
      crossOriginOpenerPolicy: 'same-origin-allow-popups',
      crossOriginResourcePolicy: 'same-site',
      originAgentCluster: '?1',
      referrerPolicy: 'strict-origin-when-cross-origin',
      xContentTypeOptions: 'nosniff',
      xDnsPrefetchControl: 'off',
      xDownloadOptions: 'noopen',
      xFrameOptions: 'SAMEORIGIN',
      xPermittedCrossDomainPolicies: 'none',
      xXssProtection: '1; mode=block',
    },
    rateLimiter: {
      tokensPerInterval: 100,
      interval: 'minute',
      fireImmediately: true,
    },
  },

  // Fix hydration mismatches
  vue: {
    compilerOptions: {
      whitespace: 'preserve',
      isCustomElement: (tag) => tag === 'client-only',
    },
  },

  // Experimental features config - disable suspense warnings
  experimental: {
    suspense: false,
    emitRouteChunkError: false,
  },

  // Nitro server config for security headers
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      },
    },
  },

  compatibilityDate: '2024-01-01',
});
