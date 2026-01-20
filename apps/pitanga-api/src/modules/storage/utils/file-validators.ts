/**
 * File validation utilities for content uploads.
 *
 * @author Luiz Gama
 */

/**
 * Supported image MIME types
 */
export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Supported video MIME types
 */
export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
];

/**
 * Maximum file sizes in bytes
 */
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 500 * 1024 * 1024, // 500MB
};

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  errors: string[];
  fileType?: 'image' | 'video';
}

/**
 * Validate a file for upload
 */
export function validateFile(
  mimeType: string,
  fileSize: number,
): FileValidationResult {
  const errors: string[] = [];
  let fileType: 'image' | 'video' | undefined;

  // Check MIME type
  if (IMAGE_MIME_TYPES.includes(mimeType)) {
    fileType = 'image';
  } else if (VIDEO_MIME_TYPES.includes(mimeType)) {
    fileType = 'video';
  } else {
    errors.push(
      `Unsupported file type: ${mimeType}. Supported types: ${[...IMAGE_MIME_TYPES, ...VIDEO_MIME_TYPES].join(', ')}`,
    );
    return { valid: false, errors };
  }

  // Check file size
  const maxSize = fileType === 'image' ? MAX_FILE_SIZES.image : MAX_FILE_SIZES.video;
  if (fileSize > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    errors.push(
      `File too large: ${fileSizeMB}MB. Maximum size for ${fileType}s is ${maxSizeMB}MB`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    fileType,
  };
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExtension: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogv',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
  };
  return mimeToExtension[mimeType] || 'bin';
}

/**
 * Generate a unique filename
 */
export function generateUniqueFilename(
  originalName: string,
  mimeType: string,
): string {
  const extension = getExtensionFromMimeType(mimeType);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  // Remove special characters from original name
  const safeName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .toLowerCase()
    .substring(0, 50); // Limit length
  return `${safeName}-${timestamp}-${random}.${extension}`;
}
