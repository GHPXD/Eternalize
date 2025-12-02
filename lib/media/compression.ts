import imageCompression from "browser-image-compression";
import { COMPRESSION_SETTINGS, MEMORY_LIMITS } from "@/lib/constants";
import { logger } from "@/lib/logger";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
  initialQuality?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxSizeMB: COMPRESSION_SETTINGS.IMAGE_MAX_SIZE_MB,
  maxWidthOrHeight: COMPRESSION_SETTINGS.IMAGE_MAX_WIDTH_OR_HEIGHT,
  useWebWorker: COMPRESSION_SETTINGS.USE_WEB_WORKER,
};

/**
 * OPTIMIZED: Convert and compress image to WebP format
 * This enforces WebP conversion for ALL images (JPG, PNG, etc.)
 * Reduces storage costs and improves load times significantly
 * 
 * @param file - Original image file (JPG, PNG, etc.)
 * @returns WebP file with correct naming and headers
 */
export async function compressImageToWebP(file: File): Promise<File> {
  try {
    // Force WebP conversion with optimal settings
    const options = {
      maxSizeMB: 1,                          // Max 1MB per image
      maxWidthOrHeight: 1920,                // Full HD limit
      useWebWorker: true,                    // Performance boost
      fileType: 'image/webp',                // FORCE WebP format
      initialQuality: 0.85,                  // Good quality/size balance
    };

    // Compress and convert to WebP
    const compressedBlob = await imageCompression(file, options);

    // CRITICAL: Rename file to .webp extension
    // This ensures correct Content-Type headers in R2
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    const webpFileName = `${originalName}.webp`;
    
    // Create new File object with WebP extension and correct MIME type
    const webpFile = new File([compressedBlob], webpFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    return webpFile;
  } catch (error) {
    logger.error("WebP conversion failed", error);
    throw new Error("Failed to convert image to WebP format");
  }
}

/**
 * Compress an image file before uploading (legacy method)
 * @deprecated Use compressImageToWebP for better performance and cost savings
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Compressed image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const compressionOptions = { ...DEFAULT_OPTIONS, ...options };

  try {
    const compressedFile = await imageCompression(file, compressionOptions);
    return compressedFile;
  } catch (error) {
    logger.error("Image compression failed", error);
    throw new Error("Failed to compress image");
  }
}

/**
 * Validate if file is an image
 * @param file - File to validate
 * @returns True if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Validate if file is a video
 * @param file - File to validate
 * @returns True if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

/**
 * Validate if file is an audio
 * @param file - File to validate
 * @returns True if file is an audio
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith("audio/");
}

/**
 * Validate file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns True if file size is within limit
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
}

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

/**
 * Validate image file before upload
 * @param file - Image file to validate
 * @param maxSizeMB - Maximum file size in MB (before compression)
 * @returns Validation result
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = MEMORY_LIMITS.IMAGE_MAX_SIZE_MB
): { valid: boolean; error?: string } {
  if (!isImageFile(file)) {
    return { valid: false, error: "File must be an image" };
  }

  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate video file before upload
 * @param file - Video file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateVideoFile(
  file: File,
  maxSizeMB: number = MEMORY_LIMITS.VIDEO_MAX_SIZE_MB
): { valid: boolean; error?: string } {
  if (!isVideoFile(file)) {
    return { valid: false, error: "File must be a video" };
  }

  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `Video size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate audio file before upload
 * @param file - Audio file to validate
 * @param maxSizeMB - Maximum file size in MB
 * @returns Validation result
 */
export function validateAudioFile(
  file: File,
  maxSizeMB: number = MEMORY_LIMITS.AUDIO_MAX_SIZE_MB
): { valid: boolean; error?: string } {
  if (!isAudioFile(file)) {
    return { valid: false, error: "File must be an audio file" };
  }

  if (!validateFileSize(file, maxSizeMB)) {
    return {
      valid: false,
      error: `Audio size must be less than ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}
