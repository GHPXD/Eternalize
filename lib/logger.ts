/**
 * Centralized logging utility
 * Provides consistent error logging across the application
 * In production, can be extended to send to error tracking services (Sentry, etc.)
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'error':
        console.error(prefix, message, context || '');
        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        break;
      case 'warn':
        console.warn(prefix, message, context || '');
        break;
      case 'info':
        console.info(prefix, message, context || '');
        break;
      case 'debug':
        console.debug(prefix, message, context || '');
        break;
    }
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error | unknown, context?: LogContext) {
    let errorDetails: Record<string, unknown> = {};
    
    if (error instanceof Error) {
      errorDetails = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error && typeof error === 'object') {
      // Handle Supabase errors and other object errors
      errorDetails = {
        ...error as Record<string, unknown>,
      };
      // Try to extract common error properties
      const err = error as Record<string, unknown>;
      if (err.message) errorDetails.message = err.message;
      if (err.code) errorDetails.code = err.code;
      if (err.details) errorDetails.details = err.details;
      if (err.hint) errorDetails.hint = err.hint;
    } else if (error) {
      errorDetails = { value: String(error) };
    }

    const errorContext = {
      ...context,
      error: Object.keys(errorDetails).length > 0 ? errorDetails : undefined,
    };
    this.log('error', message, errorContext);
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }
}

export const logger = new Logger();
