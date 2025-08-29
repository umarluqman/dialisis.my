/**
 * Client-side utilities for image handling
 */

export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): ImageValidationResult {
  // Check file type
  if (!file.type.startsWith("image/")) {
    return {
      isValid: false,
      error: "File must be an image",
    };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Image must be smaller than 5MB",
    };
  }

  // Check if it's a supported format
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Supported formats: JPEG, PNG, WebP, GIF",
    };
  }

  return { isValid: true };
}

/**
 * Validate multiple image files
 */
export function validateImageFiles(files: FileList | File[]): {
  validFiles: File[];
  errors: string[];
} {
  const validFiles: File[] = [];
  const errors: string[] = [];

  Array.from(files).forEach((file, index) => {
    const validation = validateImageFile(file);
    if (validation.isValid) {
      validFiles.push(file);
    } else {
      errors.push(`File ${index + 1}: ${validation.error}`);
    }
  });

  return { validFiles, errors };
}

/**
 * Generate a preview URL for an image file
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Check if browser supports drag and drop
 */
export function supportsDragAndDrop(): boolean {
  const div = document.createElement("div");
  return (
    ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
    "FormData" in window &&
    "FileReader" in window
  );
}

