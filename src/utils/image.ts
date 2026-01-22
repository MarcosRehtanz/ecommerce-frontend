/**
 * Gets the image source with priority: imageData > imageUrl > fallback
 */
export function getProductImageSrc(
  imageData?: string | null,
  imageUrl?: string | null,
  fallback = 'https://placehold.co/300x200?text=Sin+imagen'
): string {
  if (imageData) return imageData;
  if (imageUrl) return imageUrl;
  return fallback;
}

/**
 * Converts a File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Validates file size (max 2MB by default)
 */
export function validateFileSize(file: File, maxSizeMB = 2): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validates file type (images only)
 */
export function validateImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}
