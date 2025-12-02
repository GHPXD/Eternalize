/**
 * Constants used throughout the application
 */

// Memory limits
export const MEMORY_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 2000,
  MEDIA_MAX_COUNT: 50,
  IMAGE_MAX_SIZE_MB: 10,
  VIDEO_MAX_SIZE_MB: 100,
  AUDIO_MAX_SIZE_MB: 10,
} as const;

// Compression settings
// WebP optimization: All images are converted to WebP format client-side
// This reduces storage costs on R2 and improves page load performance
export const COMPRESSION_SETTINGS = {
  IMAGE_MAX_SIZE_MB: 1,              // Target: 1MB max per image (WebP)
  IMAGE_MAX_WIDTH_OR_HEIGHT: 1920,   // Full HD resolution limit
  USE_WEB_WORKER: true,              // Parallel processing for performance
} as const;

// Database tables (PostgreSQL)
export const COLLECTIONS = {
  MEMORIES: "memories",
  USERS: "users",
} as const;

// Storage folders
export const STORAGE_FOLDERS = {
  MEMORIES: "memories",
  AUDIO: "audio",
  THUMBNAILS: "thumbnails",
} as const;

// Time constants
export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
} as const;

// ISR revalidation times
export const REVALIDATE = {
  MEMORY_PAGE: 86400, // 24 hours
  HOME_PAGE: 3600, // 1 hour
} as const;

// Status messages
export const MESSAGES = {
  ERROR: {
    UPLOAD_FAILED: "Failed to upload file. Please try again.",
    SAVE_FAILED: "Failed to save. Please try again.",
    DELETE_FAILED: "Failed to delete. Please try again.",
    AUTH_REQUIRED: "You must be logged in to perform this action.",
    INVALID_DATA: "Please fill in all required fields.",
    NETWORK_ERROR: "Network error. Please check your connection.",
  },
  SUCCESS: {
    UPLOAD_COMPLETE: "Upload completed successfully!",
    SAVE_COMPLETE: "Saved successfully!",
    DELETE_COMPLETE: "Deleted successfully!",
  },
} as const;

// Default values
export const DEFAULTS = {
  PRIMARY_COLOR: "#8b5cf6",
  ITEMS_PER_PAGE: 12,
} as const;
