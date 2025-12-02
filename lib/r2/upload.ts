import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2Client, getR2BucketName, getR2PublicUrl } from "./config";

export interface PresignedUploadUrl {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

/**
 * Generate a presigned URL for uploading a file to R2
 * @param fileName - Original file name
 * @param fileType - MIME type of the file
 * @param folder - Folder path in the bucket (e.g., 'memories', 'audio')
 * @returns Presigned upload URL and public URL
 */
export async function generatePresignedUploadUrl(
  fileName: string,
  fileType: string,
  folder: string = "memories"
): Promise<PresignedUploadUrl> {
  const bucketName = getR2BucketName();
  const publicUrl = getR2PublicUrl();
  
  // Validate R2 configuration
  if (!bucketName || !publicUrl) {
    throw new Error("R2 configuration is missing. Check environment variables.");
  }

  // Generate unique key with timestamp to prevent collisions
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${folder}/${timestamp}-${randomString}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  // Generate presigned URL that expires in 1 hour
  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: 3600,
  });

  // Construct the public URL
  const filePublicUrl = `${publicUrl}/${key}`;

  return {
    uploadUrl,
    publicUrl: filePublicUrl,
    key,
  };
}

/**
 * Upload file to R2 using presigned URL
 * @param uploadUrl - Presigned upload URL
 * @param file - File to upload
 * @param onProgress - Optional progress callback
 */
export async function uploadToR2(
  uploadUrl: string,
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}

/**
 * Delete a file from R2
 * @param key - The object key in R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
  });

  await getR2Client().send(command);
}

/**
 * Extract the key from a public URL
 * @param publicUrl - The public URL of the file
 * @returns The object key
 */
export function extractKeyFromUrl(publicUrl: string): string {
  const url = new URL(publicUrl);
  return url.pathname.substring(1); // Remove leading slash
}

/**
 * Delete file by public URL
 * @param publicUrl - The public URL of the file
 */
export async function deleteByUrl(publicUrl: string): Promise<void> {
  const key = extractKeyFromUrl(publicUrl);
  await deleteFromR2(key);
}
