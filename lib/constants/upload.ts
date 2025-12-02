/**
 * Upload limits and constraints
 * These limits protect infrastructure costs and ensure fast UX
 */

// File size limits in bytes
export const UPLOAD_LIMITS = {
  // Images: Max 15MB input -> compresses to <1MB WebP output
  IMAGE_MAX_SIZE: 15 * 1024 * 1024, // 15MB
  IMAGE_MAX_SIZE_MB: 15,
  
  // Audio/Music: Max 10MB (enough for a full high-quality song)
  AUDIO_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  AUDIO_MAX_SIZE_MB: 10,
  
  // Video: Strict 100MB limit (no client-side conversion)
  VIDEO_MAX_SIZE: 100 * 1024 * 1024, // 100MB
  VIDEO_MAX_SIZE_MB: 100,
} as const;

// Supported file types
export const SUPPORTED_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'],
  VIDEO: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/m4a'],
} as const;

// Error messages in Portuguese
export const UPLOAD_ERRORS = {
  IMAGE_TOO_LARGE: `Imagem muito grande (Máx ${UPLOAD_LIMITS.IMAGE_MAX_SIZE_MB}MB). Tente uma imagem menor.`,
  VIDEO_TOO_LARGE: `Vídeo muito grande (Máx ${UPLOAD_LIMITS.VIDEO_MAX_SIZE_MB}MB). Tente cortar ou diminuir a qualidade.`,
  AUDIO_TOO_LARGE: `Arquivo de áudio muito grande (Máx ${UPLOAD_LIMITS.AUDIO_MAX_SIZE_MB}MB).`,
  UNSUPPORTED_TYPE: 'Tipo de arquivo não suportado.',
  UPLOAD_FAILED: 'Falha no upload. Tente novamente.',
} as const;

// Helper functions
export function getFileType(file: File): 'image' | 'video' | 'audio' | 'unknown' {
  if (SUPPORTED_TYPES.IMAGE.some(type => file.type.startsWith(type.split('/')[0]))) {
    return 'image';
  }
  if (SUPPORTED_TYPES.VIDEO.some(type => file.type.startsWith(type.split('/')[0]))) {
    return 'video';
  }
  if (SUPPORTED_TYPES.AUDIO.some(type => file.type.startsWith(type.split('/')[0]))) {
    return 'audio';
  }
  return 'unknown';
}

export function validateFileSize(file: File): { valid: boolean; error?: string } {
  const fileType = getFileType(file);
  
  switch (fileType) {
    case 'image':
      if (file.size > UPLOAD_LIMITS.IMAGE_MAX_SIZE) {
        return { valid: false, error: UPLOAD_ERRORS.IMAGE_TOO_LARGE };
      }
      break;
    case 'video':
      if (file.size > UPLOAD_LIMITS.VIDEO_MAX_SIZE) {
        return { valid: false, error: UPLOAD_ERRORS.VIDEO_TOO_LARGE };
      }
      break;
    case 'audio':
      if (file.size > UPLOAD_LIMITS.AUDIO_MAX_SIZE) {
        return { valid: false, error: UPLOAD_ERRORS.AUDIO_TOO_LARGE };
      }
      break;
    case 'unknown':
      return { valid: false, error: UPLOAD_ERRORS.UNSUPPORTED_TYPE };
  }
  
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
