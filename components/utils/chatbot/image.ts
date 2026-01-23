// Image validation and processing utilities

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFileType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function validateFileSize(file: File): boolean {
  return file.size <= MAX_IMAGE_SIZE;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function stripDataUrlPrefix(base64: string): string {
  if (base64.includes(",")) {
    return base64.split(",")[1];
  }
  return base64;
}

