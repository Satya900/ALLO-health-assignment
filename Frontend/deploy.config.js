/**
 * Deployment configuration for the Clinic Front Desk System
 */

export const deployConfig = {
  // Build settings
  build: {
    target: 'es2015',
    minify: true,
    sourcemap: false,
    outDir: 'dist',
  },

  // Server settings
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    compression: true,
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
    },
  },

  // Security headers
  security: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self' data:",
        "connect-src 'self' " + (process.env.VITE_API_URL || 'http://localhost:8000'),
      ].join('; '),
    },
  },

  // Cache settings
  cache: {
    static: {
      maxAge: '1y',
      immutable: true,
    },
    html: {
      maxAge: '0',
      mustRevalidate: true,
    },
    api: {
      maxAge: '5m',
    },
  },

  // Health check endpoint
  healthCheck: {
    path: '/health',
    response: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    },
  },

  // Monitoring
  monitoring: {
    enableMetrics: process.env.NODE_ENV === 'production',
    metricsPath: '/metrics',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

export default deployConfig;